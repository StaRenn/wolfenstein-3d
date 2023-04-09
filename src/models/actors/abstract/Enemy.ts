import { SpriteObstacle } from 'src/models/obstacles/Sprite';

import { Ray } from 'src/models/actors/Wolf/internal/Ray';
import { Actor, ActorParams } from 'src/models/actors/abstract/Actor';

import { AnimationController } from 'src/models/utility/AnimationController';

import { AMMO_ID, ENEMY_FOV, ENEMY_VIEW_DISTANCE, ITEMS_PURPOSES, TILE_SIZE } from 'src/constants/config';

import {
  getAngleBetweenVertexes,
  getDistanceBetweenVertexes,
  getIsVertexInTheTriangle,
  getRangeOfView,
  toRadians,
} from 'src/helpers/maths';

import type { EnemyDirections, EntityFrameSetByAction, Frame, ParsedMap, Triangle, Vertex } from 'src/types';
import { isDirectedFrameSetByAction, isDoor, isNonDirectedFrameSetByAction, isWall } from 'src/types/typeGuards';
import { ItemObstacle } from 'src/models/obstacles/Item';
import { getImageWithSource } from 'src/utils/getImageWithSource';

export type EnemyParams = {
  initialAction: Enemy['_currentState'];
  frameSet: Enemy['_frameSet'];
} & ActorParams;

// enemy model has 8 sides
const SIDE = toRadians(360 / 8);
const HALF_SIDE = SIDE / 2;

export abstract class Enemy extends Actor {
  protected _currentState: keyof EntityFrameSetByAction;
  protected _frameSet: EntityFrameSetByAction;
  protected _sprite: SpriteObstacle;
  protected _animationController: AnimationController<Frame<HTMLImageElement>>;
  protected _currentSide: EnemyDirections[number];

  public readonly isEnemy: true;

  protected constructor(params: EnemyParams) {
    super(params);

    this.isEnemy = true;

    this._currentState = params.initialAction;
    this._frameSet = params.frameSet;
    this._currentSide = 'FRONT';

    const frameSet = isNonDirectedFrameSetByAction(this._currentState)
      ? this._frameSet[this._currentState]
      : this._frameSet[this._currentState][this._currentSide];

    this._animationController = new AnimationController({
      frameSet,
      isLoopAnimation: true,
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
  }

  get currentState() {
    return this._currentState;
  }

  castToPosition(position: Vertex, parsedMap: ParsedMap) {
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
      .castDDA(parsedMap, angleBetweenEnemyAndWolf)
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

  takeDamage(wolfPosition: Vertex, damage: number, parsedMap: ParsedMap) {
    this._health -= damage;

    if (this._health <= 0) {
      this.changeState('DIE');
      this._animationController.onAnimationEnd = () => {};
      this.dropAmmo(parsedMap);
    } else {
      this.changeState('TAKING_DAMAGE');

      const castResult = this.castToPosition(wolfPosition, parsedMap);

      this._angle = castResult.angle;
      this._animationController.onAnimationEnd = () => {
        this.changeState('IDLE');
      };
    }
  }

  private dropAmmo(parsedMap: ParsedMap) {
    parsedMap[this.currentMatrixPosition.y][this.currentMatrixPosition.x] = new ItemObstacle({
      position: {
        x1: this.currentMatrixPosition.x * TILE_SIZE,
        y1: this.currentMatrixPosition.y * TILE_SIZE,
        x2: this.currentMatrixPosition.x * TILE_SIZE + TILE_SIZE,
        y2: this.currentMatrixPosition.y * TILE_SIZE + TILE_SIZE,
      },
      hasCollision: false,
      texture: getImageWithSource(`src/assets/sprites/items/${AMMO_ID}.png`),
      rawValue: '34_SPRITE_HOLLOW_ITEM',
      purpose: ITEMS_PURPOSES[AMMO_ID],
    });
  }

  private changeState(newState: Enemy['_currentState']) {
    this._currentState = newState;

    if (isNonDirectedFrameSetByAction(newState)) {
      this._animationController.updateFrameSet(this._frameSet[newState]);
    } else {
      this._animationController.updateFrameSet(this._frameSet[newState][this._currentSide]);
    }
  }

  private checkForWolfInView(wolfPosition: Vertex, parsedMap: ParsedMap) {
    const castResult = this.castToPosition(wolfPosition, parsedMap);

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

  private updateSprite(wolfPosition: Vertex, wolfAngle: number) {
    if (isDirectedFrameSetByAction(this._currentState)) {
      let angleBetweenEnemyAndWolf = getAngleBetweenVertexes(this._position, wolfPosition) - this._angle;
      let newSide = this._currentSide;

      if (angleBetweenEnemyAndWolf <= 0) {
        angleBetweenEnemyAndWolf = Math.PI * 2 + angleBetweenEnemyAndWolf;
      }

      if (angleBetweenEnemyAndWolf <= HALF_SIDE || angleBetweenEnemyAndWolf > HALF_SIDE + SIDE * 7) {
        newSide = 'FRONT';
      } else if (angleBetweenEnemyAndWolf < HALF_SIDE + SIDE) {
        newSide = 'FRONT_RIGHT';
      } else if (angleBetweenEnemyAndWolf < HALF_SIDE + SIDE * 2) {
        newSide = 'RIGHT';
      } else if (angleBetweenEnemyAndWolf < HALF_SIDE + SIDE * 3) {
        newSide = 'BACK_LEFT';
      } else if (angleBetweenEnemyAndWolf < HALF_SIDE + SIDE * 4) {
        newSide = 'BACK';
      } else if (angleBetweenEnemyAndWolf < HALF_SIDE + SIDE * 5) {
        newSide = 'BACK_RIGHT';
      } else if (angleBetweenEnemyAndWolf < HALF_SIDE + SIDE * 6) {
        newSide = 'LEFT';
      } else if (angleBetweenEnemyAndWolf < HALF_SIDE + SIDE * 7) {
        newSide = 'FRONT_LEFT';
      }

      if (newSide !== this._currentSide) {
        this._currentSide = newSide;

        const currentFrameIdx = this._animationController.currentFrameIdx;

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
  }

  getPreparedSprite() {
    return this._sprite;
  }

  iterate(wolfPosition: Vertex, wolfAngle: number, parsedMap: ParsedMap) {
    this.updateSprite(wolfPosition, wolfAngle);

    if (this._currentState !== 'DIE') {
      this.checkForWolfInView(wolfPosition, parsedMap);
    }

    this._attackTimeout.iterate();
    this._animationController.iterate();
  }
}
