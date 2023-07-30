import { OBSTACLES_MOVE_SPEED, TILE_SIZE } from 'src/constants/config';

import { StaticObstacle, StaticObstacleParams } from './StaticObstacle';

import type { Vector, Vertex } from 'src/types';

export type DynamicObstacleParams = StaticObstacleParams & {
  initialPosition: DynamicObstacle['_initialPosition'];
  endPosition: DynamicObstacle['_endPosition'];
  isMoving: DynamicObstacle['_isMoving'];
  isMovable: DynamicObstacle['isMovable'];
  isInFinalPosition: DynamicObstacle['_isInFinalPosition'];
  isInStartPosition: DynamicObstacle['_isInStartPosition'];
};

export abstract class DynamicObstacle extends StaticObstacle {
  protected _endPositionMatrixCoordinates: Vertex;
  protected _initialPosition: Vector;
  protected _endPosition: Vector;
  protected _isMoving: boolean;
  protected _isInFinalPosition: boolean;
  protected _isInStartPosition: boolean;

  public readonly isMovable: boolean;

  protected constructor(params: DynamicObstacleParams) {
    super(params);

    this._initialPosition = params.initialPosition;
    this._endPosition = params.endPosition;
    this._isMoving = params.isMoving;
    this._isInFinalPosition = params.isInFinalPosition;
    this._isInStartPosition = params.isInStartPosition;

    this._endPositionMatrixCoordinates = {
      x: Math.floor(this._endPosition.x1 / TILE_SIZE),
      y: Math.floor(this._endPosition.y1 / TILE_SIZE),
    };

    this.isMovable = params.isMovable;
  }

  get endPositionMatrixCoordinates() {
    return this._endPositionMatrixCoordinates;
  }

  get initialPosition() {
    return this._initialPosition;
  }

  get endPosition() {
    return this._endPosition;
  }

  get isMoving() {
    return this._isMoving;
  }

  get isInFinalPosition() {
    return this._isInFinalPosition;
  }

  get isInStartPosition() {
    return this._isInStartPosition;
  }

  static getPositionChange(startPosition: number, endPosition: number) {
    if (startPosition > endPosition) {
      return -OBSTACLES_MOVE_SPEED;
    }

    if (startPosition < endPosition) {
      return OBSTACLES_MOVE_SPEED;
    }

    return 0;
  }

  move() {
    if (!this.isMovable) {
      return true;
    }

    this._isMoving = true;

    const finalPosition = this._isInStartPosition ? this._endPosition : this._initialPosition;

    this._position = {
      x1: this._position.x1 + DynamicObstacle.getPositionChange(this._position.x1, finalPosition.x1) * TIME_SCALE,
      y1: this._position.y1 + DynamicObstacle.getPositionChange(this._position.y1, finalPosition.y1) * TIME_SCALE,
      x2: this._position.x2 + DynamicObstacle.getPositionChange(this._position.x2, finalPosition.x2) * TIME_SCALE,
      y2: this._position.y2 + DynamicObstacle.getPositionChange(this._position.y2, finalPosition.y2) * TIME_SCALE,
    };

    // if reached end position
    if (
      Math.round(this._position.x1 * TILE_SIZE) / TILE_SIZE === finalPosition.x1 &&
      Math.round(this._position.y1 * TILE_SIZE) / TILE_SIZE === finalPosition.y1 &&
      Math.round(this._position.x2 * TILE_SIZE) / TILE_SIZE === finalPosition.x2 &&
      Math.round(this._position.y2 * TILE_SIZE) / TILE_SIZE === finalPosition.y2
    ) {
      this._position = finalPosition;
      this._isMoving = false;
      this._isInStartPosition = !this._isInStartPosition;
      this._isInFinalPosition = !this._isInFinalPosition;

      return true;
    }

    return false;
  }
}
