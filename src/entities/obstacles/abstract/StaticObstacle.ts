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
      x: Math.floor(this._position.x1 / TILE_SIZE),
      y: Math.floor(this._position.y1 / TILE_SIZE),
    };

    this.hasCollision = params.hasCollision;
    this.rawValue = params.rawValue;
  }

  set position(newPosition: Vector) {
    this._position = newPosition;

    this._matrixCoordinates = {
      x: Math.floor(this._position.x1 / TILE_SIZE),
      y: Math.floor(this._position.y1 / TILE_SIZE),
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
