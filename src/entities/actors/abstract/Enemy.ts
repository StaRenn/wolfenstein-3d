import type { ActorParams } from 'src/entities/actors/abstract/Actor';
import { SpriteObstacle } from 'src/entities/obstacles/Sprite';

import { Animation } from 'src/controllers/Animation';

import { TILE_SIZE } from 'src/constants/config';

import { getAngleBetweenVertexes, toRadians } from 'src/utils/maths';

import { EnemyAI } from './EnemyAI';

import type { EnemyDirections, EnemyFrameSetByAction, EnemyFrameSetByState, Frame, Vertex } from 'src/types';

export type EnemyParams = {
  initialState: Enemy['_currentState'];
  initialAction: Enemy['_currentAction'];
  stateFrameSet: Enemy['_stateFrameSet'];
  actionFrameSet: Enemy['_actionFrameSet'];
  speed: Enemy['_speed'];
  viewDistance: Enemy['_viewDistance'];
} & ActorParams;

const ENEMY_SIDES_AMOUNT = 8;
const SIDE = toRadians(360 / ENEMY_SIDES_AMOUNT);
const HALF_SIDE = SIDE / 2;

export abstract class Enemy extends EnemyAI {
  protected _stateFrameSet: EnemyFrameSetByState;
  protected _actionFrameSet: EnemyFrameSetByAction;
  protected _sprite: SpriteObstacle;
  protected _animationController: Animation<Frame<HTMLImageElement>>;
  protected _currentSide: EnemyDirections[number];

  protected constructor(params: EnemyParams) {
    super(params);

    this._stateFrameSet = params.stateFrameSet;
    this._actionFrameSet = params.actionFrameSet;
    this._currentSide = 'FRONT';

    const initialFrameSet = this._currentAction
      ? this._actionFrameSet[this._currentAction]
      : this._stateFrameSet[this._currentState][this._currentSide];

    this._animationController = new Animation({
      frameSet: initialFrameSet,
      isLoopAnimation: true,
      emitter: this._emitter,
    });

    if (params.initialAction === 'DIE') {
      this._animationController.setActiveFrameIdx(initialFrameSet.length - 1);
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
  }

  get currentState() {
    return this._currentState;
  }

  get currentAction() {
    return this._currentAction;
  }

  private updateActiveFrameSet() {
    const frameSet = this._currentAction
      ? this._actionFrameSet[this._currentAction]
      : this._stateFrameSet[this._currentState][this._currentSide];

    this._animationController.updateFrameSet(frameSet);
  }

  protected onCurrentStateChange() {
    this.updateActiveFrameSet();
  }

  protected onCurrentActionChange() {
    this.updateActiveFrameSet();

    if (this._currentAction !== 'DIE') {
      this._animationController.onAnimationEnd = () => {
        this.setCurrentAction(null);
      };
    }
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

        const { currentFrameIdx } = this._animationController;

        this._animationController.updateFrameSet(this._stateFrameSet[this._currentState][this._currentSide]);
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
}
