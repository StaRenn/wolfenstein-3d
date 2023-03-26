import { Vector, Vertex } from '../../types';
import { OBSTACLES_MOVE_SPEED } from '../../constants/config';

export type EntityParams = {
  matrixCoordinates: Vertex;
  position: Vector;
  rawValue: string | number;
  hasCollision: boolean;
  texture: HTMLImageElement;
};

export abstract class Entity {
  protected _position: Vector;
  protected _matrixCoordinates: Vertex;

  public readonly texture: HTMLImageElement;
  public readonly rawValue: string | number;

  public hasCollision: boolean;

  protected constructor(params: EntityParams) {
    this._matrixCoordinates = params.matrixCoordinates;
    this._position = params.position;
    this.hasCollision = params.hasCollision;

    this.texture = params.texture;
    this.rawValue = params.rawValue;
  }

  get position() {
    return this._position;
  }

  get matrixCoordinates() {
    return this._matrixCoordinates;
  }
}
