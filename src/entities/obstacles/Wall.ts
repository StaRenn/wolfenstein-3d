import {
  DOOR_SIDE_WALL_TEXTURE_DARK_ID,
  DOOR_SIDE_WALL_TEXTURE_ID,
  INTERSECTION_TYPES,
  OBSTACLE_SIDES,
  TILE_SIZE,
} from 'src/constants/config';

import { getImageWithSource } from 'src/utils/getImageWithSource';

import { DynamicObstacle, DynamicObstacleParams } from './abstract/DynamicObstacle';

export type WallParams = DynamicObstacleParams & {
  textureDark: WallObstacle['textureDark'];
  neighborIsDoorMap: Record<keyof typeof OBSTACLE_SIDES, boolean>;
};

export class WallObstacle extends DynamicObstacle {
  private _textureDark: HTMLImageElement;
  private _neighborIsDoorMap: Record<keyof typeof OBSTACLE_SIDES, boolean>;
  private _wallSides: Record<keyof typeof OBSTACLE_SIDES, WallObstacle>;

  public readonly isWall: true;
  public readonly intersectionType: keyof typeof INTERSECTION_TYPES;
  public readonly shouldReverseTexture: boolean;

  constructor(params: WallParams) {
    super(params);

    this.intersectionType = INTERSECTION_TYPES.HORIZONTAL;
    this.shouldReverseTexture = false;
    this.isWall = true;

    this._textureDark = params.textureDark;
    this._neighborIsDoorMap = params.neighborIsDoorMap;
    this._wallSides = {
      TOP: this.getWallSide(OBSTACLE_SIDES.TOP, this._neighborIsDoorMap.TOP),
      RIGHT: this.getWallSide(OBSTACLE_SIDES.RIGHT, this._neighborIsDoorMap.RIGHT),
      BOTTOM: this.getWallSide(OBSTACLE_SIDES.BOTTOM, this._neighborIsDoorMap.BOTTOM),
      LEFT: this.getWallSide(OBSTACLE_SIDES.LEFT, this._neighborIsDoorMap.LEFT),
    };
  }

  get wallSides() {
    return this._wallSides;
  }

  set textureDark(newTextureDark: HTMLImageElement) {
    this._textureDark = newTextureDark;
  }

  get textureDark() {
    return this._textureDark;
  }

  move() {
    const result = super.move();

    this._wallSides = {
      TOP: this.getWallSide(OBSTACLE_SIDES.TOP, this._neighborIsDoorMap.TOP),
      RIGHT: this.getWallSide(OBSTACLE_SIDES.RIGHT, this._neighborIsDoorMap.RIGHT),
      BOTTOM: this.getWallSide(OBSTACLE_SIDES.BOTTOM, this._neighborIsDoorMap.BOTTOM),
      LEFT: this.getWallSide(OBSTACLE_SIDES.LEFT, this._neighborIsDoorMap.LEFT),
    };

    return result;
  }

  getWallSide(side: keyof typeof OBSTACLE_SIDES, neighborIsDoor: boolean): WallObstacle {
    const isVertical = side === OBSTACLE_SIDES.TOP || side === OBSTACLE_SIDES.BOTTOM;

    const position = {
      x1: this.position.x1 + (side === OBSTACLE_SIDES.RIGHT ? TILE_SIZE : 0),
      y1: this.position.y1 + (side === OBSTACLE_SIDES.BOTTOM ? TILE_SIZE : 0),
      x2: this.position.x2 - (side === OBSTACLE_SIDES.LEFT ? TILE_SIZE : 0),
      y2: this.position.y2 - (side === OBSTACLE_SIDES.TOP ? TILE_SIZE : 0),
    };

    let texture = this._texture;
    let textureDark = this._textureDark;

    if (neighborIsDoor) {
      texture = getImageWithSource(`src/static/assets/textures/${DOOR_SIDE_WALL_TEXTURE_ID}.png`);
      textureDark = getImageWithSource(`src/static/assets/textures/${DOOR_SIDE_WALL_TEXTURE_DARK_ID}.png`);
    }

    return {
      ...this,
      position,
      intersectionType: isVertical ? INTERSECTION_TYPES.VERTICAL : INTERSECTION_TYPES.HORIZONTAL,
      shouldReverseTexture: !neighborIsDoor && (side === OBSTACLE_SIDES.LEFT || side === OBSTACLE_SIDES.BOTTOM),
      texture,
      textureDark,
    };
  }
}
