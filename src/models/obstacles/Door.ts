import { MovableEntity, MovableEntityParams } from '../abstract/MovableEntity';
import { Timeout } from '../Timeout';
import { INTERSECTION_TYPES, TILE_SIZE } from '../../constants/config';

export type DoorParams = MovableEntityParams & {
  textureDark: HTMLImageElement;
  closeTimeout: null | Timeout;
  isVertical: boolean;
};

export class DoorObstacle extends MovableEntity {
  public readonly textureDark: HTMLImageElement;
  public readonly isVertical: boolean;
  public readonly isDoor: true;
  public readonly shouldReverseTexture: boolean;
  public readonly intersectionType: keyof typeof INTERSECTION_TYPES;

  public closeTimeout: null | Timeout;

  constructor(params: DoorParams) {
    super(params);

    this.textureDark = params.textureDark;
    this.isVertical = params.isVertical;
    this.isDoor = true;
    this.closeTimeout = params.closeTimeout;
    this.shouldReverseTexture = !params.isVertical;
    this.intersectionType = params.isVertical ? INTERSECTION_TYPES.VERTICAL : INTERSECTION_TYPES.HORIZONTAL;
  }
}
