import { TILE_SIZE } from 'src/constants/config';

import type { Vector, Vertex } from 'src/types';

export type StaticObstacleParams = {
  position: StaticObstacle['_position'];
  rawValue: StaticObstacle['rawValue'];
  hasCollision: StaticObstacle['hasCollision'];
  texture: StaticObstacle['_texture'];
};

export abstract class StaticObstacle {
  protected _position: Vector;
  protected _matrixCoordinates: Vertex;
  protected _texture: HTMLImageElement;

  public readonly rawValue: string | number;

  public hasCollision: boolean;

  protected constructor(params: StaticObstacleParams) {
    this._position = params.position;
    this._texture = params.texture;

    this._matrixCoordinates = {
      x: Math.floor(Math.min(this._position.x1, this._position.x2) / TILE_SIZE),
      y: Math.floor(Math.min(this._position.y1, this._position.y2) / TILE_SIZE),
    };

    this.hasCollision = params.hasCollision;
    this.rawValue = params.rawValue;
  }

  set position(newPosition: Vector) {
    this._position = newPosition;

    this._matrixCoordinates = {
      x: Math.floor(Math.min(this._position.x1, this._position.x2) / TILE_SIZE),
      y: Math.floor(Math.min(this._position.y1, this._position.y2) / TILE_SIZE),
    };
  }

  get position() {
    return this._position;
  }

  set texture(newTexture: HTMLImageElement) {
    this._texture = newTexture;
  }

  get texture() {
    return this._texture;
  }

  get matrixCoordinates() {
    return this._matrixCoordinates;
  }
}
