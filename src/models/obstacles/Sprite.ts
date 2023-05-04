import { TILE_SIZE } from 'src/constants/config';

import { Entity, EntityParams } from './abstract/Entity';

import type { Vector } from 'src/types';

export class SpriteObstacle extends Entity {
  public readonly isSprite: true;

  constructor(params: EntityParams) {
    super(params);

    this.isSprite = true;
  }

  // sprite should be always perpendicular to player view angle
  rotatePerpendicularlyToView(angle: number): SpriteObstacle {
    const coordinates: Vector = {
      x1: this._position.x1,
      y1: this._position.y1,
      x2: this._position.x2,
      y2: this._position.y2,
    };

    const middleVertex = {
      x: (coordinates.x2 + coordinates.x1) / 2,
      y: (coordinates.y2 + coordinates.y1) / 2,
    };

    const spriteAngle = -angle;

    this.position = {
      x1: middleVertex.x + (TILE_SIZE / 2) * Math.cos(spriteAngle),
      y1: middleVertex.y + (TILE_SIZE / 2) * Math.sin(spriteAngle),
      x2: middleVertex.x - (TILE_SIZE / 2) * Math.cos(spriteAngle),
      y2: middleVertex.y - (TILE_SIZE / 2) * Math.sin(spriteAngle),
    };

    return this;
  }
}
