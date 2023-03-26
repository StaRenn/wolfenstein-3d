import { Vector } from '../../types';
import { TILE_SIZE } from '../../constants/config';
import { Entity, EntityParams } from '../abstract/Entity';

export class SpriteObstacle extends Entity {
  public readonly isSprite: true;

  constructor(params: EntityParams) {
    super(params);

    this.isSprite = true;
  }

  getRotatedPerpendicularlyToViewPosition(angle: number): SpriteObstacle {
    const coordinates: Vector = {
      x1: this.position.x1,
      y1: this.position.y1,
      x2: this.position.x2,
      y2: this.position.y2,
    };

    const middleVertex = {
      x: (coordinates.x2 + coordinates.x1) / 2,
      y: (coordinates.y2 + coordinates.y1) / 2,
    };

    let spriteAngle = -angle;

    return {
      ...this,
      position: {
        x1: middleVertex.x + (TILE_SIZE / 2) * Math.cos(spriteAngle),
        y1: middleVertex.y + (TILE_SIZE / 2) * Math.sin(spriteAngle),
        x2: middleVertex.x - (TILE_SIZE / 2) * Math.cos(spriteAngle),
        y2: middleVertex.y - (TILE_SIZE / 2) * Math.sin(spriteAngle),
      },
    };
  }
}
