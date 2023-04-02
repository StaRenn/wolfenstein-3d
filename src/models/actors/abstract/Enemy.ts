import { SpriteObstacle } from 'src/models/obstacles/Sprite';

import { AnimationController } from 'src/models/utility/AnimationController';

import { TILE_SIZE } from 'src/constants/config';

import { getAngleBetweenVertexes, toRadians } from 'src/helpers/maths';

import { Actor, ActorParams } from 'src/models/actors/abstract/Actor';

import type { EnemyDirections, EntityFrameSetByAction, Frame, Vertex } from 'src/types';

export type EnemyParams = {
  initialAction: Enemy['_currentAction'];
  frameSet: Enemy['_frameSet'];
} & ActorParams;

// enemy model has 8 sides
const SIDE = toRadians(360 / 8);
const HALF_SIDE = SIDE / 2;

export abstract class Enemy extends Actor {
  protected _currentAction: keyof EntityFrameSetByAction;
  protected _frameSet: EntityFrameSetByAction;
  protected _sprite: SpriteObstacle;
  protected _animationController: AnimationController<Frame<HTMLImageElement>>;
  protected _currentSide: EnemyDirections[number];

  public readonly isEnemy: true;

  protected constructor(params: EnemyParams) {
    super(params);

    this.isEnemy = true;

    this._currentAction = params.initialAction;
    this._frameSet = params.frameSet;
    this._currentSide = 'FRONT';

    this._animationController = new AnimationController({
      frameSet: this._frameSet[this._currentAction][this._currentSide],
      isLoopAnimation: true,
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
  }

  private updateSprite(wolfPosition: Vertex, wolfAngle: number) {
    let angleBetweenEnemyAndWolf = getAngleBetweenVertexes(this._position, wolfPosition) + this._angle;
    let newSide = this._currentSide;

    if (angleBetweenEnemyAndWolf <= 0) {
      angleBetweenEnemyAndWolf = Math.PI * 2 + angleBetweenEnemyAndWolf;
    }

    if (angleBetweenEnemyAndWolf <= HALF_SIDE || angleBetweenEnemyAndWolf > HALF_SIDE + SIDE * 7) {
      newSide = 'BACK';
    } else if (angleBetweenEnemyAndWolf < HALF_SIDE + SIDE) {
      newSide = 'BACK_RIGHT';
    } else if (angleBetweenEnemyAndWolf < HALF_SIDE + SIDE * 2) {
      newSide = 'LEFT';
    } else if (angleBetweenEnemyAndWolf < HALF_SIDE + SIDE * 3) {
      newSide = 'FRONT_LEFT';
    } else if (angleBetweenEnemyAndWolf < HALF_SIDE + SIDE * 4) {
      newSide = 'FRONT';
    } else if (angleBetweenEnemyAndWolf < HALF_SIDE + SIDE * 5) {
      newSide = 'FRONT_RIGHT';
    } else if (angleBetweenEnemyAndWolf < HALF_SIDE + SIDE * 6) {
      newSide = 'RIGHT';
    } else if (angleBetweenEnemyAndWolf < HALF_SIDE + SIDE * 7) {
      newSide = 'BACK_LEFT';
    }

    if (newSide !== this._currentSide) {
      this._currentSide = newSide;

      const currentFrameIdx = this._animationController.currentFrameIdx;

      this._animationController.updateFrameSet(this._frameSet[this._currentAction][this._currentSide]);
      this._animationController.setActiveFrameIdx(currentFrameIdx);
    }

    this._sprite.texture = this._animationController.currentFrame.data;
    this._sprite.position = {
      x1: this.currentMatrixPosition.x * TILE_SIZE,
      y1: this.currentMatrixPosition.y * TILE_SIZE,
      x2: this.currentMatrixPosition.x * TILE_SIZE + TILE_SIZE,
      y2: this.currentMatrixPosition.y * TILE_SIZE + TILE_SIZE,
    };
    this._sprite.rotatePerpendicularlyToView(wolfAngle);
  }

  getPreparedSprite() {
    return this._sprite;
  }

  iterate(wolfPosition: Vertex, wolfAngle: number) {
    this.updateSprite(wolfPosition, wolfAngle);

    this._attackTimeout.iterate();
    this._animationController.iterate();
  }
}
