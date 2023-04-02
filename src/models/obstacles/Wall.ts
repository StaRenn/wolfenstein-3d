import {
  DOOR_SIDE_WALL_TEXTURE_DARK_ID,
  DOOR_SIDE_WALL_TEXTURE_ID,
  INTERSECTION_TYPES,
  OBSTACLE_SIDES,
  TILE_SIZE,
} from 'src/constants/config';

import { getImageWithSource } from 'src/utils/getImageWithSource';

import { MovableEntity, MovableEntityParams } from './abstract/MovableEntity';

import type { Obstacle } from 'src/types';
import { isDoor } from 'src/types/typeGuards';

export type WallParams = MovableEntityParams & {
  textureDark: WallObstacle['textureDark'];
};

export class WallObstacle extends MovableEntity {
  private _textureDark: HTMLImageElement;

  public readonly isWall: true;
  public readonly intersectionType: keyof typeof INTERSECTION_TYPES;
  public readonly shouldReverseTexture: boolean;

  constructor(params: WallParams) {
    super(params);

    this.isWall = true;

    this._textureDark = params.textureDark;

    this.intersectionType = INTERSECTION_TYPES.HORIZONTAL;
    this.shouldReverseTexture = false;
  }

  set textureDark(newTextureDark: HTMLImageElement) {
    this._textureDark = newTextureDark;
  }

  get textureDark() {
    return this._textureDark;
  }

  // get side of the wall
  getWallBySide(side: keyof typeof OBSTACLE_SIDES, neighbor: Obstacle | null): WallObstacle {
    const isVertical = side === OBSTACLE_SIDES.TOP || side === OBSTACLE_SIDES.BOTTOM;

    const position = {
      x1: this.position.x1 + (side === OBSTACLE_SIDES.RIGHT ? TILE_SIZE : 0),
      y1: this.position.y1 + (side === OBSTACLE_SIDES.BOTTOM ? TILE_SIZE : 0),
      x2: this.position.x2 - (side === OBSTACLE_SIDES.LEFT ? TILE_SIZE : 0),
      y2: this.position.y2 - (side === OBSTACLE_SIDES.TOP ? TILE_SIZE : 0),
    };

    let texture = this._texture;
    let textureDark = this._textureDark;

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
