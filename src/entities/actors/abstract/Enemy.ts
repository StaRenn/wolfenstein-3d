import { Actor, ActorParams } from 'src/entities/actors/abstract/Actor';
import { SpriteObstacle } from 'src/entities/obstacles/Sprite';

import { Ray } from 'src/services/Ray';

import { Animation } from 'src/controllers/Animation';

import { ENEMY_FOV, ENEMY_VIEW_DISTANCE, TILE_SIZE } from 'src/constants/config';

import {
  getAngleBetweenVertexes,
  getDistanceBetweenVertexes,
  getIsVertexInTheTriangle,
  getRangeOfView,
  toRadians,
} from 'src/utils/maths';

import type { EnemyDirections, EnemyTypes, EntityFrameSetByAction, Frame, Triangle, Vertex } from 'src/types';
import { isDirectedFrameSetByAction, isDoor, isNonDirectedFrameSetByAction, isWall } from 'src/types/typeGuards';

export type EnemyParams = {
  initialAction: Enemy['_currentState'];
  frameSet: Enemy['_frameSet'];
  type: Enemy['_type'];
} & ActorParams;

// enemy model has 8 sides
const SIDE = toRadians(360 / 8);
const HALF_SIDE = SIDE / 2;

export abstract class Enemy extends Actor {
  protected _currentState: keyof EntityFrameSetByAction;
  protected _frameSet: EntityFrameSetByAction;
  protected _sprite: SpriteObstacle;
  protected _animationController: Animation<Frame<HTMLImageElement>>;
  protected _currentSide: EnemyDirections[number];
  protected _type: EnemyTypes;

  public readonly isEnemy: true;

  protected constructor(params: EnemyParams) {
    super(params);

    this.isEnemy = true;

    this._currentState = params.initialAction;
    this._frameSet = params.frameSet;
    this._currentSide = 'FRONT';
    this._type = params.type;

    const frameSet = isNonDirectedFrameSetByAction(this._currentState)
      ? this._frameSet[this._currentState]
      : this._frameSet[this._currentState][this._currentSide];

    this._animationController = new Animation({
      frameSet,
      isLoopAnimation: true,
      emitter: this._emitter,
    });

    if (this._currentState === 'DIE') {
      this._animationController.setActiveFrameIdx(frameSet.length - 1);
    }

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

    this.registerEvents();
  }

  private registerEvents() {
    this._emitter.on('wolfPositionChange', this.checkForWolfInView.bind(this));
  }

  get currentState() {
    return this._currentState;
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
      .castDDA(this._parsedMap, angleBetweenEnemyAndWolf)
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

  hit(damage: number) {
    this._health -= damage;

    if (this._health <= 0) {
      this.changeState('DIE');

      this._emitter.emit('enemyDie', this);
      this._animationController.onAnimationEnd = () => {};
    } else {
      this.changeState('TAKING_DAMAGE');

      this._animationController.onAnimationEnd = () => {
        this.changeState('IDLE');
      };
    }
  }

  private changeState(newState: Enemy['_currentState']) {
    this._currentState = newState;

    if (isNonDirectedFrameSetByAction(newState)) {
      this._animationController.updateFrameSet(this._frameSet[newState]);
    } else {
      this._animationController.updateFrameSet(this._frameSet[newState][this._currentSide]);
    }
  }

  private checkForWolfInView(wolfPosition: Vertex) {
    if (this._currentState === 'DIE') {
      return;
    }

    const castResult = this.castToPosition(wolfPosition);

    const rangeOfView: Triangle = getRangeOfView(this._angle, ENEMY_FOV, this._position);

    if (!getIsVertexInTheTriangle(wolfPosition, rangeOfView)) {
      return;
    }

    if (castResult.distance > ENEMY_VIEW_DISTANCE) {
      return;
    }

    if (castResult.isVisible) {
      this._angle = castResult.angle;
    }
  }

  getPreparedSprite(wolfPosition: Vertex, wolfAngle: number) {
    if (isDirectedFrameSetByAction(this._currentState)) {
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

        const { currentFrameIdx } = this._animationController;

        this._animationController.updateFrameSet(this._frameSet[this._currentState][this._currentSide]);
        this._animationController.setActiveFrameIdx(currentFrameIdx);
      }
    }

    this._sprite.texture = this._animationController.currentFrame.data;
    this._sprite.position = {
      x1: this.currentMatrixPosition.x * TILE_SIZE,
      y1: this.currentMatrixPosition.y * TILE_SIZE,
      x2: this.currentMatrixPosition.x * TILE_SIZE + TILE_SIZE,
      y2: this.currentMatrixPosition.y * TILE_SIZE + TILE_SIZE,
    };
    this._sprite.rotatePerpendicularlyToView(wolfAngle);

    return this._sprite;
  }
}
