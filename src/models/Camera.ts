type PreparedNeighbor = {
  isDoor: boolean;
  isSecret: boolean;
  isMovable: boolean;
  number: number;
};

type IndexedIntersection = Intersection & { index: number };

class Camera {
  private readonly ctx: CanvasRenderingContext2D;

  private rays: Ray[];
  private position: Vertex;
  private walls: Wall[];
  private sprites: Wall[];

  public angle: number;

  constructor(position: Vertex, raysAmount: number, ctx: CanvasRenderingContext2D, walls: Wall[], sprites: Wall[]) {
    this.angle = this.toRadians(60);
    this.ctx = ctx;
    this.walls = walls;
    this.sprites = sprites;
    this.position = position;

    canvas.addEventListener('mousemove', this.rotate.bind(this));

    this.changeRaysAmount(raysAmount);
  }

  updatePosition(position: Vertex) {
    for (let i = 0; i < this.rays.length; i++) {
      this.rays[i].move(position);
    }

    this.position = position;
  }

  updateObstacles(walls: Wall[], sprites: Wall[]) {
    this.walls = walls;
    this.sprites = sprites;
  }

  toRadians(angle: number) {
    return (angle * Math.PI) / 180;
  }

  hasEqualPosition(firstPosition: Vector, secondPosition: Vector) {
    return (
      firstPosition.x1 === secondPosition.x1 &&
      firstPosition.y1 === secondPosition.y1 &&
      firstPosition.x2 === secondPosition.x2 &&
      firstPosition.y2 === secondPosition.y2
    );
  }

  getVertexByPositionAndAngle(position: Vertex, angle: number) {
    return {
      x: position.x + RAY_LENGTH * Math.sin(angle),
      y: position.y + RAY_LENGTH * Math.cos(angle),
    };
  }

  getViewAngleIntersection(position: Vector) {
    const currentAngleRayEndVertex = this.getVertexByPositionAndAngle(this.position, this.angle);

    return Ray.getIntersectionVertexWithWall(
      {
        x1: this.position.x,
        y1: this.position.y,
        x2: currentAngleRayEndVertex.x,
        y2: currentAngleRayEndVertex.y,
      },
      position
    );
  }

  getIntersections() {
    let wallsIntersections: IndexedIntersection[] = [];
    let spritesIntersections: IndexedIntersection[] = [];

    for (let i = 0; i < this.rays.length; i++) {
      const wallsIntersection = this.rays[i].cast(this.walls);
      wallsIntersections.push({ ...wallsIntersection, index: i });

      const spritesIntersection = this.rays[i].cast(this.sprites);
      spritesIntersections.push({ ...spritesIntersection, index: i });
    }

    return {
      walls: wallsIntersections,
      sprites: spritesIntersections,
    };
  }

  changeRaysAmount(raysAmount: number) {
    this.rays = [];

    const initialAngle = this.angle - FOV / 2;
    const step = FOV / raysAmount / RESOLUTION_SCALE;

    for (let i = 0; i < raysAmount * RESOLUTION_SCALE; i++) {
      this.rays.push(new Ray(this.position, initialAngle + i * step, this.angle));
    }
  }

  rotate(event: MouseEvent) {
    this.angle += this.toRadians(event.movementX / 3);

    this.angle = this.angle % (2 * Math.PI);

    const initialAngle = this.angle - FOV / 2;
    const step = FOV / this.rays.length;

    for (let i = 0; i < this.rays.length; i++) {
      this.rays[i].changeAngle(initialAngle + i * step, this.angle);
    }
  }
}
