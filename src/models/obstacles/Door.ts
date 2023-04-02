import type { Timeout } from 'src/models/utility/Timeout';

import { INTERSECTION_TYPES } from 'src/constants/config';

import { MovableEntity, MovableEntityParams } from './abstract/MovableEntity';

export type DoorParams = MovableEntityParams & {
  textureDark: DoorObstacle['_textureDark'];
  closeTimeout: DoorObstacle['closeTimeout'];
  isVertical: DoorObstacle['isVertical'];
};

export class DoorObstacle extends MovableEntity {
  public _textureDark: HTMLImageElement;

  public readonly isVertical: boolean;
  public readonly isDoor: true;
  public readonly shouldReverseTexture: boolean;
  public readonly intersectionType: keyof typeof INTERSECTION_TYPES;

  public closeTimeout: null | Timeout;

  get textureDark() {
    return this._textureDark;
  }

  constructor(params: DoorParams) {
    super(params);

    this._textureDark = params.textureDark;

    this.isVertical = params.isVertical;
    this.isDoor = true;
    this.closeTimeout = params.closeTimeout;
    this.shouldReverseTexture = !params.isVertical;
    this.intersectionType = params.isVertical ? INTERSECTION_TYPES.VERTICAL : INTERSECTION_TYPES.HORIZONTAL;
  }
}
