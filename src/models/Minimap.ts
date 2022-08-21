class Minimap {
  private readonly ctx: CanvasRenderingContext2D;
  private readonly obstacles: Obstacle[];

  constructor(ctx: Minimap['ctx'], obstacles: Minimap['obstacles']) {
    this.ctx = ctx;
    this.obstacles = obstacles;
  }

  render(position: Vertex, intersections: IndexedIntersection<Wall>[]) {
    this.ctx.strokeStyle = 'orange';
    this.ctx.beginPath();

    for (let i = 0; i < intersections.length; i++) {
      const intersection = intersections[i];

      this.ctx.moveTo(position.x, position.y);
      this.ctx.lineTo(intersection.x, intersection.y);
    }

    this.ctx.closePath();
    this.ctx.stroke();

    this.ctx.fillStyle = 'white';

    for (let obstacle of this.obstacles) {
      if (!obstacle.isDoor && !obstacle.isSprite) {
        this.ctx.fillRect(obstacle.position.x1, obstacle.position.y1, TILE_SIZE, TILE_SIZE);
      }
    }
  }
}
