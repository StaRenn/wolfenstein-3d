class Camera {
  private readonly ctx: CanvasRenderingContext2D;

  private rays: Ray[];
  private position: Vertex;
  private walls: Wall[];
  private sprites: Sprite[];

  public angle: number;

  constructor(
    position: Camera['position'],
    raysAmount: number,
    ctx: Camera['ctx'],
    walls: Camera['walls'],
    sprites: Camera['sprites']
  ) {
    this.angle = this.toRadians(60);
    this.ctx = ctx;
    this.walls = walls;
    this.sprites = sprites;
    this.position = position;

    canvas.addEventListener('mousemove', this.rotate.bind(this));

    this.changeRaysAmount(raysAmount);
  }

  updatePosition(position: Camera['position']) {
    for (let i = 0; i < this.rays.length; i++) {
      this.rays[i].move(position);
    }

    this.position = position;
  }

  updateObstacles(walls: Camera['walls'], sprites: Camera['sprites']) {
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

    return Ray.getIntersectionVertexWithPlane(
      {
        x1: this.position.x,
        y1: this.position.y,
        x2: currentAngleRayEndVertex.x,
        y2: currentAngleRayEndVertex.y,
      },
      position
    );
  }

  getIntersections(): { walls: IndexedIntersection<Wall>[]; sprites: IndexedIntersection<Sprite>[] } {
    let wallsIntersections: IndexedIntersection<Wall>[] = [];
    let spritesIntersections: IndexedIntersection<Sprite>[] = [];

    for (let i = 0; i < this.rays.length; i++) {
      const wallsIntersection = this.rays[i].cast(this.walls);

      if (wallsIntersection) {
        wallsIntersections.push({ ...wallsIntersection, index: i });
      }

      const spritesIntersectionsWithCurrentRay = this.sprites
        .map((sprite) => this.rays[i].cast([sprite]))
        .filter((intersection): intersection is Intersection<Sprite> => intersection !== null);

      if (spritesIntersectionsWithCurrentRay.length > 0) {
        spritesIntersectionsWithCurrentRay.forEach((intersection) => {
          spritesIntersections.push({ ...intersection, index: i });
        });
      }
    }

    return {
      walls: wallsIntersections,
      sprites: spritesIntersections,
    };
  }

  changeRaysAmount(raysAmount: number) {
    this.rays = [];

    // you are my hero https://stackoverflow.com/a/55247059/17420897
    const trueRaysAmount = Math.floor(raysAmount * RESOLUTION_SCALE);
    const screenHalfLength = Math.tan(FOV / 2);
    const segmentLength = screenHalfLength / (trueRaysAmount / 2);

    for (let i = 0; i < trueRaysAmount; i++) {
      this.rays.push(new Ray(this.position, this.angle + Math.atan(segmentLength * i - screenHalfLength), this.angle));
    }
  }

  rotate(event: MouseEvent) {
    this.angle += this.toRadians(event.movementX / 3);

    this.angle = this.angle % (2 * Math.PI);

    const screenHalfLength = Math.tan(FOV / 2);
    const segmentLength = screenHalfLength / ((Math.floor(this.rays.length / 10) * 10) / 2);

    for (let i = 0; i < this.rays.length; i++) {
      this.rays[i].changeAngle(this.angle + Math.atan(segmentLength * i - screenHalfLength), this.angle);
    }
  }
}
