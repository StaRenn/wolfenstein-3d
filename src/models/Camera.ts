class Camera {
  private readonly ctx: CanvasRenderingContext2D;
  private rays: Ray[];
  private obstacles: Vector[];
  private position: Vertex;
  private speed: number;
  private angle: number;

  constructor(
    position: Vertex,
    raysAmount: number,
    ctx: CanvasRenderingContext2D,
    obstacles: Vector[]
  ) {
    this.angle = this.toRadians(60);
    this.speed = 0;
    this.ctx = ctx;
    this.obstacles = obstacles;
    this.position = position;

    window.addEventListener('keydown', this.handleKeyDown.bind(this));
    window.addEventListener('keyup', this.handleKeyUp.bind(this));
    window.addEventListener('mousemove', this.rotate.bind(this));

    this.changeRaysAmount(raysAmount);
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'w') {
      this.speed = CAMERA_SPEED;
    } else if (event.key === 's') {
      this.speed = -CAMERA_SPEED;
    }
  }

  handleKeyUp(event: KeyboardEvent) {
    if (event.key === 'w' || event.key === 's') {
      this.speed = 0;
    }
  }


  toRadians(angle: number) {
    return (angle * Math.PI) / 180;
  }

  getAreaSize(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) {
    return Math.abs((x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)) / 2.0);
  }
  // https://www.geeksforgeeks.org/check-whether-a-given-point-lies-inside-a-triangle-or-not/
  getIsVertexInTheTriangle({ x, y }: Vertex, { x1, y1, x2, y2, x3, y3 }: Triangle) {
    /* Calculate area of triangle ABC */
    let A = this.getAreaSize(x1, y1, x2, y2, x3, y3);
    /* Calculate area of triangle PBC */
    let A1 = this.getAreaSize(x, y, x2, y2, x3, y3);
    /* Calculate area of triangle PAC */
    let A2 = this.getAreaSize(x1, y1, x, y, x3, y3);
    /* Calculate area of triangle PAB */
    let A3 = this.getAreaSize(x1, y1, x2, y2, x, y);
    /* Check if sum of A1, A2 and A3 is same as A */
    return Math.round(A) == Math.round(A1 + A2 + A3);
  }

  getVertexByPositionAndAngle(position: Vertex, angle: number) {
    return {
      x: position.x + RAY_LENGTH * Math.sin(angle),
      y: position.y + RAY_LENGTH * Math.cos(angle),
    };
  }

  getWallVectorFromObstacle(obstacle: Vector, wallPosition: keyof typeof OBSTACLE_SIDES) {
    return {
      x1: obstacle.x1 + (wallPosition === OBSTACLE_SIDES.RIGHT ? CELL_SIZE : 0),
      y1: obstacle.y1 + (wallPosition === OBSTACLE_SIDES.BOTTOM ? CELL_SIZE : 0),
      x2: obstacle.x2 - (wallPosition === OBSTACLE_SIDES.LEFT ? CELL_SIZE : 0),
      y2: obstacle.y2 - (wallPosition === OBSTACLE_SIDES.TOP ? CELL_SIZE : 0),
    };
  }

  getWallFromObstacle(obstacle: Vector, type: keyof typeof OBSTACLE_SIDES) {
    const isVertical = type === OBSTACLE_SIDES.TOP || type === OBSTACLE_SIDES.BOTTOM;

    return {
      position: this.getWallVectorFromObstacle(obstacle, type),
      type: isVertical ? INTERSECTION_TYPES.VERTICAL : INTERSECTION_TYPES.HORIZONTAL,
    };
  }

  getVisibleObstacles() {
    const leftExtremumAngle = this.angle - FOV;
    const rightExtremumAngle = this.angle + FOV;

    const currentAngleRayEndVertex = this.getVertexByPositionAndAngle(this.position, this.angle);
    const leftFOVExtremumVertex = this.getVertexByPositionAndAngle(
      currentAngleRayEndVertex,
      leftExtremumAngle
    );
    const rightFOVExtremumVertex = this.getVertexByPositionAndAngle(
      currentAngleRayEndVertex,
      rightExtremumAngle
    );

    const lengthBoundaries = {
      x1: this.position.x - RAY_LENGTH,
      y1: this.position.y - RAY_LENGTH,
      x2: this.position.x + RAY_LENGTH,
      y2: this.position.y + RAY_LENGTH,
    };

    const rangeBoundaries = {
      x1: this.position.x,
      y1: this.position.y,
      x2: leftFOVExtremumVertex.x,
      y2: leftFOVExtremumVertex.y,
      x3: rightFOVExtremumVertex.x,
      y3: rightFOVExtremumVertex.y,
    };
    // For optimization, we must reduce the number of vectors with which intersections are searched
    const visibleWalls = this.obstacles.reduce<Wall[]>((acc, obstacle) => {
      if (this.position.x <= obstacle.x1) {
        acc.push(this.getWallFromObstacle(obstacle, OBSTACLE_SIDES.LEFT));
      }
      if (this.position.x >= obstacle.x2) {
        acc.push(this.getWallFromObstacle(obstacle, OBSTACLE_SIDES.RIGHT));
      }
      if (this.position.y <= obstacle.y1) {
        acc.push(this.getWallFromObstacle(obstacle, OBSTACLE_SIDES.TOP));
      }
      if (this.position.y >= obstacle.y2) {
        acc.push(this.getWallFromObstacle(obstacle, OBSTACLE_SIDES.BOTTOM));
      }

      return acc;
    }, []);
    // get walls that are in the FOV range
    const visibleWallsByRange = visibleWalls.filter((wall) => {
      // If user comes straight to the wall, vertexes of the wall will not be in range of vision
      // so we need to check if user looking at the wall rn
      const isLookingAt = Ray.getIntersectionVertexWithWall(
        {
          x1: this.position.x,
          y1: this.position.y,
          x2: currentAngleRayEndVertex.x,
          y2: currentAngleRayEndVertex.y,
        },
        wall
      );

      const { x1, y1, x2, y2 } = wall.position;

      return (
        isLookingAt ||
        this.getIsVertexInTheTriangle({ x: x1, y: y1 }, rangeBoundaries) ||
        this.getIsVertexInTheTriangle({ x: x2, y: y2 }, rangeBoundaries)
      );
    });
    // get walls that are in the ray length range
    const visibleWallsByLength = visibleWallsByRange.filter(
      (wall) =>
        wall.position.y1 >= lengthBoundaries.y1 &&
        wall.position.x1 >= lengthBoundaries.x1 &&
        wall.position.x2 <= lengthBoundaries.x2 &&
        wall.position.y2 <= lengthBoundaries.y2
    );

    return visibleWallsByLength;
  }

  move() {
    if (this.speed === 0) {
      return;
    }

    const position = { x: this.position.x, y: this.position.y };

    position.x += Math.sin(this.angle) * this.speed;
    position.y += Math.cos(this.angle) * this.speed;

    for (let obstacle of this.obstacles) {
      if (
        position.y >= obstacle.y1 &&
        position.y <= obstacle.y2 &&
        position.x >= obstacle.x1 &&
        position.x <= obstacle.x2
      ) {
        position.x = this.position.x;
        position.y = this.position.y;
      }
    }

    for (let i = 0; i < this.rays.length; i++) {
      this.rays[i].move(position);
    }

    this.position = position;
  }

  renderAndGetIntersections() {
    this.move();

    let intersections = [];

    this.ctx.strokeStyle = 'orange';
    this.ctx.beginPath();

    const visibleObstacles = this.getVisibleObstacles();

    for (let ray of this.rays) {
      const intersection = ray.cast(visibleObstacles);
      intersections.push(intersection);

      this.ctx.moveTo(this.position.x, this.position.y);
      this.ctx.lineTo(intersection.x, intersection.y);
    }

    this.ctx.closePath();
    this.ctx.stroke();

    return intersections;
  }

  changeRaysAmount(raysAmount: number) {
    this.rays = [];

    const initialAngle = this.angle - FOV / 2;
    const step = FOV / raysAmount;

    for (let i = 0; i < raysAmount; i++) {
      this.rays.push(new Ray(this.position, initialAngle + i * step, this.angle));
    }
  }

  rotate(event: MouseEvent) {
    this.angle += this.toRadians(event.movementX);

    const initialAngle = this.angle - FOV / 2;
    const step = FOV / this.rays.length;

    for (let i = 0; i < this.rays.length; i++) {
      this.rays[i].changeAngle(initialAngle + i * step, this.angle);
    }
  }
}
