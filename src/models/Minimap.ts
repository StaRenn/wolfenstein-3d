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

  render(position: Vertex, intersections: IndexedIntersection<Wall>[]) {
    this.ctx.strokeStyle = 'orange';
    this.ctx.beginPath();

    const width = this.columnsLength * TILE_SIZE;
    const height = this.rowsLength * TILE_SIZE;

    for (let i = 0; i < intersections.length; i++) {
      const intersection = intersections[i];

      // reverse by y
      this.ctx.moveTo(position.x, height - position.y);
      this.ctx.lineTo(intersection.x, height - intersection.y);
    }

    this.ctx.closePath();
    this.ctx.stroke();

    this.ctx.fillStyle = 'white';

    for (let obstacle of this.obstacles) {
      if (!obstacle.isDoor && !obstacle.isSprite) {
        // reverse by y
        this.ctx.fillRect(obstacle.position.x1, height - obstacle.position.y1 - TILE_SIZE, TILE_SIZE, TILE_SIZE);
      }
    }
  }
}
