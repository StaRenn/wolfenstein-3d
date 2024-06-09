import type { GameMap } from 'src/entities/GameMap';
import { Actor, ActorParams } from 'src/entities/actors/abstract/Actor';
import { SpriteObstacle } from 'src/entities/obstacles/Sprite';

import { Pathfinder } from 'src/services/Pathfinder';
import { Ray } from 'src/services/Ray';

import { Animation } from 'src/controllers/Animation';
import { Timeout } from 'src/controllers/Timeout';

import { ENEMY_FOV, TILE_SIZE } from 'src/constants/config';

import {
  getAngleBetweenVertexes,
  getDistanceBetweenVertexes,
  getIsVertexInTheTriangle,
  getRangeOfView,
  hasEqualPositionVertex,
  toRadians,
  unitVector,
} from 'src/utils/maths';

import type {
  DirectedFrameSets,
  EnemyAction,
  EnemyDirectedFrameSet,
  EnemyDirections,
  EnemyFrameSetByAction,
  EnemyState,
  Frame,
  Triangle,
  Vertex,
  Weapon,
} from 'src/types';
import { isDoor, isWall } from 'src/types/typeGuards';

export type EnemyParams = {
  initialState: Enemy['_currentState'];
  initialAction: Enemy['_currentAction'];
  speed: Enemy['_speed'];
  viewDistance: Enemy['_viewDistance'];
  angle: Enemy['_angle'];
  attackDistance: Enemy['_attackDistance'];
  attackDelayTime: Enemy['_attackDelayTime'];
  attackFrameIdx: Enemy['_attackFrameIdx'];
  attackBaseDamage: Enemy['_attackBaseDamage'];
  stateFrameSet: Enemy['_stateFrameSet'];
  actionFrameSet: Enemy['_actionFrameSet'];
} & ActorParams;

const ENEMY_SIDES_AMOUNT = 8;
const SIDE = toRadians(360 / ENEMY_SIDES_AMOUNT);
const HALF_SIDE = SIDE / 2;

export abstract class Enemy extends Actor {
  public readonly isEnemy: true;

  protected readonly _initialMatrixPosition: Vertex;
  protected readonly _initialAngle: number;

  protected readonly _viewDistance: number;
  protected readonly _attackDistance: number;
  protected readonly _attackDelayTime: number;
  protected readonly _attackFrameIdx: number;
  protected readonly _attackBaseDamage: number;
  protected readonly _speed: number;

  protected _stateFrameSet: EnemyDirectedFrameSet;
  protected _actionFrameSet: EnemyFrameSetByAction;
  protected _sprite: SpriteObstacle;
  protected _animationController: Animation<Frame<HTMLImageElement>>;
  protected _attackTimeout: Timeout;
  protected _currentSide: EnemyDirections[number];

  protected _pathfinder: null | Pathfinder;

  protected _currentFrameSetName: DirectedFrameSets;
  protected _currentState: EnemyState;
  protected _currentAction: EnemyAction | null;

  protected _angle: number;

  protected _targetMatrixPosition: Vertex | null;
  protected _wolfMatrixPosition: Vertex;
  protected _wolfPosition: Vertex;

  protected constructor(params: EnemyParams) {
    super(params);

    this.isEnemy = true;

    this._stateFrameSet = params.stateFrameSet;
    this._actionFrameSet = params.actionFrameSet;

    this._currentFrameSetName = 'IDLE';
    this._currentState = params.initialState;
    this._currentAction = null;
    this._currentSide = 'FRONT';

    this._attackTimeout = new Timeout(this._emitter);

    const directedFrameSet: DirectedFrameSets =
      this._horizontalSpeed !== 0 || this._verticalSpeed !== 0 ? 'RUN' : 'IDLE';

    const initialFrameSet = this._currentAction
      ? this._actionFrameSet[this._currentAction]
      : this._stateFrameSet[directedFrameSet][this._currentSide];

    this._animationController = new Animation({
      frameSet: initialFrameSet,
      isLoopAnimation: true,
      emitter: this._emitter,
    });

    this._sprite = new SpriteObstacle({
      hasCollision: false,
      position: {
        x1: this.currentMatrixPosition.x * TILE_SIZE,
        y1: this.currentMatrixPosition.y * TILE_SIZE,
        x2: this.currentMatrixPosition.x * TILE_SIZE + TILE_SIZE,
        y2: this.currentMatrixPosition.y * TILE_SIZE + TILE_SIZE,
      },
      rawValue: this._rawValue,
      texture: this._animationController.currentFrame.data,
    });

    this._angle = params.angle;
    this._initialAngle = params.angle;
    this._initialMatrixPosition = this.currentMatrixPosition;

    this._targetMatrixPosition = null;
    this._wolfPosition = { x: 0, y: 0 };
    this._wolfMatrixPosition = { x: 0, y: 0 };

    this._viewDistance = params.viewDistance;
    this._attackDistance = params.attackDistance;
    this._attackDelayTime = params.attackDelayTime;
    this._attackFrameIdx = params.attackFrameIdx;
    this._attackBaseDamage = params.attackBaseDamage;
    this._speed = params.speed;

    if (params.initialAction === 'DIE') {
      this._animationController.setActiveFrameIdx(initialFrameSet.length - 1);
    }

    this.handleGameMapReady = this.handleGameMapReady.bind(this);
    this.handleWolfPositionChange = this.handleWolfPositionChange.bind(this);
    this.checkNoise = this.checkNoise.bind(this);
    this.update = this.update.bind(this);

    this._pathfinder = null;

    this.registerEvents();
  }

  get angle() {
    return this._angle;
  }

  get currentState() {
    return this._currentState;
  }

  get currentAction() {
    return this._currentAction;
  }

  private updateActiveFrameSet() {
    const directedFrameSet: DirectedFrameSets =
      this._horizontalSpeed !== 0 || this._verticalSpeed !== 0 ? 'RUN' : 'IDLE';

    const frameSet = this._currentAction
      ? this._actionFrameSet[this._currentAction]
      : this._stateFrameSet[directedFrameSet][this._currentSide];

    this._animationController.updateFrameSet(frameSet);
  }

  protected onCurrentFrameSetNameChange(): void {
    this.updateActiveFrameSet();
  }

  protected onCurrentStateChange() {
    this.updateActiveFrameSet();
  }

  protected onCurrentActionChange() {
    this.updateActiveFrameSet();

    this._animationController.onAnimationEnd = () => {};

    if (this._currentAction === 'TAKE_DAMAGE') {
      this._animationController.onAnimationEnd = () => {
        this.setCurrentAction(null);
      };
    }

    if (this._currentAction === 'SHOOT') {
      this._animationController.onAnimationEnd = () => {
        this._attackTimeout.set(this._attackDelayTime);
        this.setCurrentAction(null);
      };

      this._animationController.onFrameChange = (index) => {
        if (index === this._attackFrameIdx && this._currentAction === 'SHOOT' && this.checkForWolfInView()) {
          const distanceToWolf =
            getDistanceBetweenVertexes(this.currentMatrixPosition, this._wolfMatrixPosition) * TILE_SIZE;

          const damageRatio = Math.max((this._attackDistance - distanceToWolf) / this._attackDistance, 0.2);

          this._emitter.emit('wolfHit', Math.round(damageRatio * this._attackBaseDamage));
        }
      };
    }
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

  hit(damage: number) {
    this._health -= damage;

    this.setCurrentState('CHASE');

    if (this._health <= 0) {
      this.die();
    } else {
      this.setCurrentAction('TAKE_DAMAGE');
    }
  }

  checkNoise(weapon: Weapon) {
    if (this._currentState !== 'IDLE') {
      return;
    }

    const distance = getDistanceBetweenVertexes(this.currentMatrixPosition, this._wolfMatrixPosition) * TILE_SIZE;

    if (distance > weapon.noiseDistance) {
      return;
    }

    // find if origin of sound can be reached, counting doors as walls if they are not opened
    const hasClearPath = this._pathfinder?.findPath(this.currentMatrixPosition, this._wolfMatrixPosition, false);

    if (hasClearPath) {
      this._targetMatrixPosition = this._wolfMatrixPosition;

      this.setCurrentState('SEARCH');
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

  protected setCurrentAction(newAction: Enemy['_currentAction']) {
    if (newAction === this._currentAction) {
      return;
    }

    this._currentAction = newAction;

    this.onCurrentActionChange();
  }

  protected setCurrentFrameSetName(newFrameSetName: DirectedFrameSets) {
    if (newFrameSetName === this._currentFrameSetName) {
      return;
    }

    this._currentFrameSetName = newFrameSetName;

    this.onCurrentFrameSetNameChange();
  }

  protected setCurrentState(newState: Enemy['_currentState']) {
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

    if (this.checkForWolfInView()) {
      this.setCurrentState('CHASE');
    }
  }

  private checkForWolfInView() {
    if (!this._gameMap) {
      return false;
    }

    const castResult = this.castToPosition(this._wolfPosition)!;
    const rangeOfView: Triangle = getRangeOfView(this._angle, ENEMY_FOV, this._position);

    if (!getIsVertexInTheTriangle(this._wolfPosition, rangeOfView)) {
      return false;
    }

    if (castResult.distance > this._viewDistance) {
      return false;
    }

    return castResult.isVisible;
  }

  move(target: Vertex) {
    if (!this._pathfinder) {
      return null;
    }

    const distanceToWolf = getDistanceBetweenVertexes(this.currentMatrixPosition, this._wolfMatrixPosition) * TILE_SIZE;
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

    const tooClose = distanceToWolf <= TILE_SIZE && this._currentState === 'CHASE';

    // stop if has obstacle with collision in path (usually waiting for door to open)
    if (!nextNavigationNode || hasCollision || tooClose) {
      this._verticalSpeed = 0;
      this._horizontalSpeed = 0;
    }

    if (this._horizontalSpeed !== 0 || this._verticalSpeed !== 0) {
      this.setCurrentFrameSetName('RUN');
    } else {
      this.setCurrentFrameSetName('IDLE');
    }

    this._position.x -= this._horizontalSpeed;
    this._position.y -= this._verticalSpeed;

    return nextNavigationNode;
  }

  getPreparedSprite(wolfPosition: Vertex, wolfAngle: number) {
    if (!this._currentAction) {
      let angleBetweenEnemyAndWolf = getAngleBetweenVertexes(this._position, wolfPosition) - this._angle;
      let newSide = this._currentSide;

      if (angleBetweenEnemyAndWolf <= 0) {
        angleBetweenEnemyAndWolf = Math.PI * 2 + angleBetweenEnemyAndWolf;
      }

      if (angleBetweenEnemyAndWolf <= HALF_SIDE || angleBetweenEnemyAndWolf > HALF_SIDE + SIDE * 7) {
        newSide = 'FRONT';
      } else if (angleBetweenEnemyAndWolf < HALF_SIDE + SIDE) {
        newSide = 'FRONT_LEFT';
      } else if (angleBetweenEnemyAndWolf < HALF_SIDE + SIDE * 2) {
        newSide = 'LEFT';
      } else if (angleBetweenEnemyAndWolf < HALF_SIDE + SIDE * 3) {
        newSide = 'BACK_RIGHT';
      } else if (angleBetweenEnemyAndWolf < HALF_SIDE + SIDE * 4) {
        newSide = 'BACK';
      } else if (angleBetweenEnemyAndWolf < HALF_SIDE + SIDE * 5) {
        newSide = 'BACK_LEFT';
      } else if (angleBetweenEnemyAndWolf < HALF_SIDE + SIDE * 6) {
        newSide = 'RIGHT';
      } else if (angleBetweenEnemyAndWolf < HALF_SIDE + SIDE * 7) {
        newSide = 'FRONT_RIGHT';
      }

      if (newSide !== this._currentSide) {
        this._currentSide = newSide;

        let { currentFrameIdx } = this._animationController;

        const directedFrameSet: DirectedFrameSets =
          this._horizontalSpeed !== 0 || this._verticalSpeed !== 0 ? 'RUN' : 'IDLE';

        const frameSet = this._stateFrameSet[directedFrameSet][this._currentSide];

        if (currentFrameIdx >= frameSet.length) {
          currentFrameIdx = 0;
        }

        this._animationController.updateFrameSet(frameSet);
        this._animationController.setActiveFrameIdx(currentFrameIdx);
      }
    }

    this._sprite.texture = this._animationController.currentFrame.data;
    this._sprite.position = {
      x1: this._position.x - TILE_SIZE / 2,
      y1: this._position.y - TILE_SIZE / 2,
      x2: this._position.x + TILE_SIZE / 2,
      y2: this._position.y + TILE_SIZE / 2,
    };
    this._sprite.rotatePerpendicularlyToView(wolfAngle);

    return this._sprite;
  }

  protected update() {
    if (this._currentAction) {
      return;
    }

    // eslint-disable-next-line default-case
    switch (this._currentState) {
      case 'CHASE': {
        const distanceToWolf =
          getDistanceBetweenVertexes(this.currentMatrixPosition, this._wolfMatrixPosition) * TILE_SIZE;

        if (distanceToWolf < this._attackDistance && this._attackTimeout.isExpired) {
          const isWolfInView = this.checkForWolfInView();

          if (isWolfInView) {
            this.setCurrentAction('SHOOT');
          }
        }
        // if wolf is too far away, change status to alert and check last wolf position in view
        if (distanceToWolf > this._viewDistance) {
          this._targetMatrixPosition = { ...this._wolfMatrixPosition };

          this.setCurrentState('SEARCH');
        }

        this.move(this._wolfMatrixPosition);

        break;
      }

      case 'SEARCH': {
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

        const isWolfInView = this.checkForWolfInView();

        if (isWolfInView) {
          this.setCurrentState('CHASE');
        }

        break;
      }
    }
  }
}
