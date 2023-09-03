import type { GameMap } from 'src/entities/GameMap';
import { Actor, ActorParams } from 'src/entities/actors/abstract/Actor';

import { Pathfinder } from 'src/services/Pathfinder';
import { Ray } from 'src/services/Ray';

import { ENEMY_FOV, TILE_SIZE } from 'src/constants/config';

import {
  getAngleBetweenVertexes,
  getDistanceBetweenVertexes,
  getIsVertexInTheTriangle,
  getRangeOfView,
  hasEqualPositionVertex,
  unitVector,
} from 'src/utils/maths';

import type { EnemyAction, EnemyState, Triangle, Vertex, Weapon } from 'src/types';
import { isDoor, isWall } from 'src/types/typeGuards';

export type EnemyParams = {
  initialState: EnemyAI['_currentState'];
  initialAction: EnemyAI['_currentAction'];
  speed: EnemyAI['_speed'];
  viewDistance: EnemyAI['_viewDistance'];
} & ActorParams;

export abstract class EnemyAI extends Actor {
  protected _initialMatrixPosition: Vertex;
  protected _initialAngle: number;

  protected _pathfinder: null | Pathfinder;

  protected _currentState: EnemyState;
  protected _currentAction: EnemyAction | null;

  protected _targetMatrixPosition: Vertex | null;
  protected _wolfMatrixPosition: Vertex;
  protected _wolfPosition: Vertex;

  protected _viewDistance: number;
  protected _speed: number;

  public readonly isEnemy: true;

  protected constructor(params: EnemyParams) {
    super(params);

    this.isEnemy = true;

    this._initialAngle = params.angle;
    this._initialMatrixPosition = this.currentMatrixPosition;

    this._targetMatrixPosition = null;
    this._wolfPosition = { x: 0, y: 0 };
    this._wolfMatrixPosition = { x: 0, y: 0 };

    this._currentState = params.initialState;
    this._currentAction = null;

    this._viewDistance = params.viewDistance;
    this._speed = params.speed;

    this.handleGameMapReady = this.handleGameMapReady.bind(this);
    this.handleWolfPositionChange = this.handleWolfPositionChange.bind(this);
    this.checkNoise = this.checkNoise.bind(this);
    this.update = this.update.bind(this);

    this._pathfinder = null;

    this.registerEvents();
  }

  get currentState() {
    return this._currentState;
  }

  get currentAction() {
    return this._currentAction;
  }

  private registerEvents() {
    this._emitter.on('gameMapReady', this.handleGameMapReady);
    this._emitter.on('wolfPositionChange', this.handleWolfPositionChange);
    this._emitter.on('wolfAttack', this.checkNoise);
    this._emitter.on('frameUpdate', this.update);
  }

  private unregisterEvents() {
    this._emitter.off('gameMapReady', this.handleGameMapReady);
    this._emitter.off('wolfPositionChange', this.handleWolfPositionChange);
    this._emitter.off('wolfAttack', this.checkNoise);
    this._emitter.off('frameUpdate', this.update);
  }

  private handleGameMapReady(gameMap: GameMap) {
    this._gameMap = gameMap;

    this._pathfinder = new Pathfinder(this._gameMap.navigationMap);
  }

  private die() {
    this.unregisterEvents();
    this.setCurrentAction('DIE');

    this._emitter.emit('enemyDie', this);
  }

  checkNoise(weapon: Weapon) {
    const distance = getDistanceBetweenVertexes(this.currentMatrixPosition, this._wolfMatrixPosition) * TILE_SIZE;

    if (distance < weapon.noiseDistance) {
      // find if origin of sound can be reached, counting doors as walls if they are not opened
      const hasClearPath = this._pathfinder?.findPath(this.currentMatrixPosition, this._wolfMatrixPosition, false);

      if (hasClearPath) {
        this._targetMatrixPosition = this._wolfMatrixPosition;

        this.setCurrentState('ALERT');
      }
    }
  }

  hit(damage: number) {
    this._health -= damage;

    this.setCurrentState('CHASE');

    if (this._health <= 0) {
      this.die();
    } else {
      this.setCurrentAction('TAKE_DAMAGE');
    }
  }

  castToPosition(position: Vertex) {
    const distanceToWolf = getDistanceBetweenVertexes(this._position, position);

    let angleBetweenEnemyAndWolf = getAngleBetweenVertexes(this._position, position);

    if (angleBetweenEnemyAndWolf <= 0) {
      angleBetweenEnemyAndWolf = Math.PI * 2 + angleBetweenEnemyAndWolf;
    }

    const ray = new Ray({
      initialPosition: this._position,
      angle: angleBetweenEnemyAndWolf,
    });

    const castResult = ray
      .castDDA(this._gameMap!.map, angleBetweenEnemyAndWolf)
      .filter(
        (intersection) =>
          isWall(intersection.obstacle) || (isDoor(intersection.obstacle) && intersection.obstacle.isInStartPosition)
      );

    const closest = castResult.sort(({ distance: distanceA }, { distance: distanceB }) => distanceA - distanceB)[0];

    return {
      isVisible: !closest || closest.distance > distanceToWolf,
      distance: distanceToWolf,
      angle: angleBetweenEnemyAndWolf,
    };
  }

  // eslint-disable-next-line class-methods-use-this
  protected onCurrentActionChange() {} // implement in parent
  // eslint-disable-next-line class-methods-use-this
  protected onCurrentStateChange() {} // implement in parent

  protected setCurrentAction(newAction: EnemyAI['_currentAction']) {
    if (newAction === this._currentAction) {
      return;
    }

    this._currentAction = newAction;

    this.onCurrentActionChange();
  }

  protected setCurrentState(newState: EnemyAI['_currentState']) {
    if (newState === this._currentState) {
      return;
    }

    this._currentState = newState;

    this.onCurrentStateChange();
  }

  private handleWolfPositionChange(wolfPosition: Vertex) {
    this._wolfMatrixPosition = {
      x: Math.floor(wolfPosition.x / TILE_SIZE),
      y: Math.floor(wolfPosition.y / TILE_SIZE),
    };

    this._wolfPosition = { ...wolfPosition };

    this.checkForWolfInView();
  }

  private checkForWolfInView() {
    if (!this._gameMap) {
      return;
    }

    const castResult = this.castToPosition(this._wolfPosition)!;
    const rangeOfView: Triangle = getRangeOfView(this._angle, ENEMY_FOV, this._position);

    if (!getIsVertexInTheTriangle(this._wolfPosition, rangeOfView)) {
      return;
    }

    if (castResult.distance > this._viewDistance) {
      return;
    }

    if (castResult.isVisible) {
      this.setCurrentState('CHASE');
    }
  }

  move(target: Vertex) {
    if (!this._pathfinder) {
      return null;
    }

    const nextNavigationNode = this._pathfinder.findPath(this.currentMatrixPosition, target, true);
    const originalObstacle = nextNavigationNode?.originalObstacle;
    const hasCollision = !!originalObstacle?.hasCollision;

    // set speed and angle if no obstacle in path
    if (nextNavigationNode && !hasCollision) {
      this._verticalSpeed = (this.position.y / TILE_SIZE - nextNavigationNode.y - 0.5) * this._speed * TIME_SCALE;
      this._horizontalSpeed = (this.position.x / TILE_SIZE - nextNavigationNode.x - 0.5) * this._speed * TIME_SCALE;

      const movingDirection = unitVector({
        x: this._horizontalSpeed,
        y: this._verticalSpeed,
      });

      this._angle = Math.atan2(movingDirection.x, movingDirection.y) + Math.PI;
    }

    // open door
    if (hasCollision && originalObstacle && isDoor(originalObstacle)) {
      this._gameMap?.interactWithObstacle(originalObstacle);
    }

    // stop if has obstacle with collision in path (usually waiting for door to open)
    if (!nextNavigationNode || hasCollision) {
      this._verticalSpeed = 0;
      this._horizontalSpeed = 0;
    }

    this._position.x -= this._horizontalSpeed;
    this._position.y -= this._verticalSpeed;

    return nextNavigationNode;
  }

  private update() {
    // eslint-disable-next-line default-case
    switch (this._currentState) {
      case 'CHASE': {
        // if wolf is too far away, change status to alert and check last wolf position in view
        if (
          getDistanceBetweenVertexes(this.currentMatrixPosition, this._wolfMatrixPosition) * TILE_SIZE >
          this._viewDistance
        ) {
          this._targetMatrixPosition = { ...this._wolfMatrixPosition };

          this.setCurrentState('ALERT');
        }

        // dont get too close to player
        if (
          Math.abs(this._wolfMatrixPosition.x - this.currentMatrixPosition.x) > 1 ||
          Math.abs(this._wolfMatrixPosition.y - this.currentMatrixPosition.y) > 1
        ) {
          this.move(this._wolfMatrixPosition);
        }

        break;
      }

      case 'ALERT': {
        const nextNavigationNode = this.move(this._targetMatrixPosition!);

        // if returned to initial position, set state to idle and angle to initial
        if (
          !nextNavigationNode &&
          this._targetMatrixPosition &&
          hasEqualPositionVertex(this._targetMatrixPosition, this._initialMatrixPosition)
        ) {
          this.setCurrentState('IDLE');

          this._angle = this._initialAngle;
        } else if (!nextNavigationNode) {
          this._targetMatrixPosition = this._initialMatrixPosition;
        }

        this.checkForWolfInView();

        break;
      }
    }
  }
}
