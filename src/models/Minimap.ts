import { Obstacle, Vertex } from '../types';
import { isWall } from '../types/typeGuards';
import { MAP_SCALE, TILE_SIZE } from '../constants/config';

export class Minimap {
  private readonly ctx: CanvasRenderingContext2D;
  private readonly obstacles: Obstacle[];
  private readonly rowsLength: number;
  private readonly columnsLength: number;

  constructor(
    ctx: Minimap['ctx'],
    obstacles: Minimap['obstacles'],
    rowsLength: Minimap['rowsLength'],
    columnsLength: Minimap['columnsLength']
  ) {
    this.ctx = ctx;
    this.obstacles = obstacles;
    this.rowsLength = rowsLength;
    this.columnsLength = columnsLength;
  }

  render(position: Vertex) {
    const height = this.rowsLength * TILE_SIZE;

    for (let obstacle of this.obstacles) {
      if (isWall(obstacle) && obstacle.isMovable) {
        this.ctx.fillStyle = 'orange';
      } else {
        this.ctx.fillStyle = 'white';
      }

      if (isWall(obstacle)) {
        // reverse by y
        this.ctx.fillRect(
          obstacle.initialPosition.x1 * MAP_SCALE,
          (height - obstacle.initialPosition.y1 - TILE_SIZE) * MAP_SCALE,
          TILE_SIZE * MAP_SCALE,
          TILE_SIZE * MAP_SCALE
        );
      }
    }

    this.ctx.fillStyle = 'blue';
    this.ctx.ellipse(
      position.x * MAP_SCALE,
      (height - position.y) * MAP_SCALE,
      TILE_SIZE * 0.8 * MAP_SCALE,
      TILE_SIZE * 0.8 * MAP_SCALE,
      0,
      0,
      360
    );
    this.ctx.fill();
  }
}
