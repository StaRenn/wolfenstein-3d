import { Vector, Vertex } from '../../types';
import { OBSTACLES_MOVE_SPEED, TILE_SIZE } from '../../constants/config';
import { Entity, EntityParams } from './Entity';

export type MovableEntityParams = EntityParams & {
  endPositionMatrixCoordinates: Vertex;
  initialPosition: Vector;
  endPosition: Vector;
  isMoving: boolean;
  isMovable: boolean;
  isInFinalPosition: boolean;
  isInStartPosition: boolean;
};

export abstract class MovableEntity extends Entity {
  protected _position: Vector;
  protected _endPositionMatrixCoordinates: Vertex;
  protected _matrixCoordinates: Vertex;
  protected _initialPosition: Vector;
  protected _endPosition: Vector;
  protected _isMoving: boolean;
  protected _isInFinalPosition: boolean;
  protected _isInStartPosition: boolean;

  public readonly isMovable: boolean;

  protected constructor(params: MovableEntityParams) {
    super(params);

    this._matrixCoordinates = params.matrixCoordinates;
    this._endPositionMatrixCoordinates = params.endPositionMatrixCoordinates;
    this._initialPosition = params.initialPosition;
    this._position = params.position;
    this._endPosition = params.endPosition;
    this._isMoving = params.isMoving;
    this._isInFinalPosition = params.isInFinalPosition;
    this._isInStartPosition = params.isInStartPosition;

    this.isMovable = params.isMovable;
  }

  get position() {
    return this._position;
  }

  get matrixCoordinates() {
    return this._matrixCoordinates;
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

  getPositionChange(startPosition: number, endPosition: number) {
    if (startPosition > endPosition) {
      return -OBSTACLES_MOVE_SPEED;
    } else if (startPosition < endPosition) {
      return OBSTACLES_MOVE_SPEED;
    }

    return 0;
  }

  iterateMovement() {
    if (IS_PAUSED || !this.isMovable) {
      return;
    }

    this._isMoving = true;

    const finalPosition = this._isInStartPosition ? this._endPosition : this._initialPosition;

    this._position = {
      x1: this._position.x1 + this.getPositionChange(this._position.x1, finalPosition.x1) * TIME_SCALE,
      y1: this._position.y1 + this.getPositionChange(this._position.y1, finalPosition.y1) * TIME_SCALE,
      x2: this._position.x2 + this.getPositionChange(this._position.x2, finalPosition.x2) * TIME_SCALE,
      y2: this._position.y2 + this.getPositionChange(this._position.y2, finalPosition.y2) * TIME_SCALE,
    };

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
