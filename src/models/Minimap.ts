class Minimap {
    private readonly ctx: CanvasRenderingContext2D;
    private readonly walls: Vector[];

    constructor(ctx: CanvasRenderingContext2D, obstacles: Vector[]) {
        this.ctx = ctx
        this.walls = obstacles;
    }

    render() {
        this.ctx.fillStyle = 'white'

        for(let wall of this.walls) {
            this.ctx.fillRect(wall.x1, wall.y1, CELL_SIZE, CELL_SIZE)
        }
    }
}