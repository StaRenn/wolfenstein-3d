class Minimap {
  private readonly ctx: CanvasRenderingContext2D;
  private readonly obstacles: Obstacle[];

  constructor(ctx: CanvasRenderingContext2D, obstacles: Obstacle[]) {
    this.ctx = ctx;
    this.obstacles = obstacles;
  }

  render() {
    this.ctx.fillStyle = 'white';

    for (let obstacle of this.obstacles) {
      if (!obstacle.isDoor && !obstacle.isSprite) {
        this.ctx.fillRect(obstacle.position.x1, obstacle.position.y1, CELL_SIZE, CELL_SIZE);
      }
    }
  }
}
