import type { Enemy } from 'src/entities/actors/abstract/Enemy';

import { MAP_SCALE, TILE_SIZE } from 'src/constants/config';

import type { Obstacle, Vertex } from 'src/types';
import { isWall } from 'src/types/typeGuards';

type MinimapParams = {
  ctx: Minimap['_ctx'];
  obstacles: Minimap['_obstacles'];
  rowsLength: Minimap['_rowsLength'];
};

export class Minimap {
  private readonly _ctx: CanvasRenderingContext2D;
  private readonly _obstacles: Obstacle[];
  private readonly _rowsLength: number;

  constructor(params: MinimapParams) {
    this._ctx = params.ctx;
    this._obstacles = params.obstacles;
    this._rowsLength = params.rowsLength;
  }

  render(position: Vertex, enemies: Enemy[]) {
    const height = this._rowsLength * TILE_SIZE;

    // walls and secrets
    for (const obstacle of this._obstacles) {
      if (isWall(obstacle) && obstacle.isMovable) {
        this._ctx.fillStyle = 'orange';
      } else {
        this._ctx.fillStyle = 'white';
      }

      if (isWall(obstacle)) {
        // reverse by y
        this._ctx.fillRect(
          obstacle.initialPosition.x1 * MAP_SCALE,
          (height - obstacle.initialPosition.y1 - TILE_SIZE) * MAP_SCALE,
          TILE_SIZE * MAP_SCALE,
          TILE_SIZE * MAP_SCALE
        );
      }
    }

    // enemies
    for (const enemy of enemies) {
      this._ctx.fillStyle = 'red';

      const endPosition = {
        x: enemy.position.x + (TILE_SIZE / MAP_SCALE) * Math.sin(enemy.angle),
        y: enemy.position.y + (TILE_SIZE / MAP_SCALE) * Math.cos(enemy.angle),
      };

      this._ctx.strokeStyle = 'orange';
      this._ctx.beginPath();
      this._ctx.moveTo(enemy.position.x * MAP_SCALE, (height - enemy.position.y) * MAP_SCALE);
      this._ctx.lineTo(endPosition.x * MAP_SCALE, (height - endPosition.y) * MAP_SCALE);
      this._ctx.closePath();
      this._ctx.stroke();

      this._ctx.beginPath();
      this._ctx.ellipse(
        enemy.position.x * MAP_SCALE,
        (height - enemy.position.y) * MAP_SCALE,
        TILE_SIZE * 0.8 * MAP_SCALE,
        TILE_SIZE * 0.8 * MAP_SCALE,
        0,
        0,
        360
      );
      this._ctx.closePath();
      this._ctx.fill();
    }

    // wolf
    this._ctx.fillStyle = 'blue';

    this._ctx.beginPath();
    this._ctx.ellipse(
      position.x * MAP_SCALE,
      (height - position.y) * MAP_SCALE,
      TILE_SIZE * 0.8 * MAP_SCALE,
      TILE_SIZE * 0.8 * MAP_SCALE,
      0,
      0,
      360
    );
    this._ctx.closePath();
    this._ctx.fill();
  }
}
