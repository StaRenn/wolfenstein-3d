class Minimap {
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

  render(position: Vertex, angle: number) {
    const endPosition = {
      x: position.x + (TILE_SIZE / MAP_SCALE) * Math.sin(angle),
      y: position.y + (TILE_SIZE / MAP_SCALE) * Math.cos(angle),
    };

    const height = this.rowsLength * TILE_SIZE;

    for (let obstacle of this.obstacles) {
      if (obstacle.isSecret) {
        this.ctx.fillStyle = 'orange';
      } else {
        this.ctx.fillStyle = 'white';
      }

      if (!obstacle.isDoor && !obstacle.isSprite) {
        // reverse by y
        this.ctx.fillRect(
          obstacle.initialPosition.x1 * MAP_SCALE,
          (height - obstacle.initialPosition.y1 - TILE_SIZE) * MAP_SCALE,
          TILE_SIZE * MAP_SCALE,
          TILE_SIZE * MAP_SCALE
        );
      }
    }

    this.ctx.strokeStyle = 'orange';
    this.ctx.beginPath();
    this.ctx.moveTo(position.x * MAP_SCALE, (height - position.y) * MAP_SCALE);
    this.ctx.lineTo(endPosition.x * MAP_SCALE, (height - endPosition.y) * MAP_SCALE);
    this.ctx.closePath();
    this.ctx.stroke();

    this.ctx.fillStyle = 'red';
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
