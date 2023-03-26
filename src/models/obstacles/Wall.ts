import { MovableEntity, MovableEntityParams } from '../abstract/MovableEntity';
import { Obstacle } from '../../types';
import { isDoor } from '../../types/typeGuards';
import {
  DOOR_SIDE_WALL_TEXTURE_DARK_ID,
  DOOR_SIDE_WALL_TEXTURE_ID,
  INTERSECTION_TYPES,
  OBSTACLE_SIDES,
  TILE_SIZE,
} from '../../constants/config';
import { getImageWithSource } from '../../utils/getImageWithSource';

export type WallParams = MovableEntityParams & {
  textureDark: HTMLImageElement;
};

export class WallObstacle extends MovableEntity {
  public readonly textureDark: HTMLImageElement;
  public readonly isWall: true;
  public readonly intersectionType: keyof typeof INTERSECTION_TYPES;
  public readonly shouldReverseTexture: boolean;

  constructor(params: WallParams) {
    super(params);

    this.isWall = true;

    this.textureDark = params.textureDark;

    this.intersectionType = INTERSECTION_TYPES.HORIZONTAL;
    this.shouldReverseTexture = false;
  }

  getWallBySide(side: keyof typeof OBSTACLE_SIDES, neighbor: Obstacle | null): WallObstacle {
    const isVertical = side === OBSTACLE_SIDES.TOP || side === OBSTACLE_SIDES.BOTTOM;

    const position = {
      x1: this.position.x1 + (side === OBSTACLE_SIDES.RIGHT ? TILE_SIZE : 0),
      y1: this.position.y1 + (side === OBSTACLE_SIDES.BOTTOM ? TILE_SIZE : 0),
      x2: this.position.x2 - (side === OBSTACLE_SIDES.LEFT ? TILE_SIZE : 0),
      y2: this.position.y2 - (side === OBSTACLE_SIDES.TOP ? TILE_SIZE : 0),
    };

    let texture = this.texture;
    let textureDark = this.textureDark;

    if (isDoor(neighbor)) {
      texture = getImageWithSource(`src/assets/textures/${DOOR_SIDE_WALL_TEXTURE_ID}.png`);
      textureDark = getImageWithSource(`src/assets/textures/${DOOR_SIDE_WALL_TEXTURE_DARK_ID}.png`);
    }

    return {
      ...this,
      position,
      intersectionType: isVertical ? INTERSECTION_TYPES.VERTICAL : INTERSECTION_TYPES.HORIZONTAL,
      shouldReverseTexture: !isDoor(neighbor) && (side === OBSTACLE_SIDES.LEFT || side === OBSTACLE_SIDES.BOTTOM),
      texture,
      textureDark,
    };
  }
}
