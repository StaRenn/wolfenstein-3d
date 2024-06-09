import { HALF_TILE_SIZE } from 'src/constants/config';

import { StaticObstacle, StaticObstacleParams } from './abstract/StaticObstacle';

export class SpriteObstacle extends StaticObstacle {
  public readonly isSprite: true;

  constructor(params: StaticObstacleParams) {
    super(params);

    this.isSprite = true;
  }

  // sprite should be always perpendicular to player view angle
  rotatePerpendicularlyToView(angle: number): SpriteObstacle {
    const middleVertex = {
      x: (this._position.x2 + this._position.x1) / 2,
      y: (this._position.y2 + this._position.y1) / 2,
    };

    const spriteAngle = -angle;
    const cos = Math.cos(spriteAngle);
    const sin = Math.sin(spriteAngle);

    this.position = {
      x1: middleVertex.x + HALF_TILE_SIZE * cos,
      y1: middleVertex.y + HALF_TILE_SIZE * sin,
      x2: middleVertex.x - HALF_TILE_SIZE * cos,
      y2: middleVertex.y - HALF_TILE_SIZE * sin,
    };

    return this;
  }
}
