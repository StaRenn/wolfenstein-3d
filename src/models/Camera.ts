type PreparedNeighbor = {
  isDoor: boolean;
  isSecret: boolean;
  isMovable: boolean;
  number: number;
};

class Camera {
  private readonly ctx: CanvasRenderingContext2D;
  private readonly map: GameMap;
  private rays: Ray[];
  private obstacles: Obstacle[];
  private position: Vertex;
  private verticalSpeed: number;
  private horizontalSpeed: number;
  private angle: number;
  private currentlyMovingObstacles: { [index: number]: Obstacle };
  private visibleWalls: {
    byLength: Wall[];
    byRange: Wall[];
  };

  constructor(
    position: Vertex,
    raysAmount: number,
    ctx: CanvasRenderingContext2D,
    obstacles: Obstacle[],
    map: GameMap
  ) {
    this.angle = this.toRadians(60);
    this.verticalSpeed = 0;
    this.horizontalSpeed = 0;
    this.ctx = ctx;
    this.obstacles = obstacles;
    this.currentlyMovingObstacles = [];
    this.position = position;
    this.map = map;

    window.addEventListener('keypress', this.handleKeyPress.bind(this));
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
    window.addEventListener('keyup', this.handleKeyUp.bind(this));
    window.addEventListener('mousemove', this.rotate.bind(this));

    this.changeRaysAmount(raysAmount);
  }

  handleKeyPress(event: KeyboardEvent) {
    if (event.keyCode === 32 /* space */) {
      let obstacleInViewIndex = null;
      let obstacleInView = null;

      for (let i = 0; i < this.obstacles.length; i++) {
        const obstacle = this.obstacles[i];

        if (!obstacle.isDoor && !obstacle.isSecret) {
          continue;
        }

        const intersection = this.getViewAngleIntersection(obstacle.position);

        const distance = Math.sqrt(
          (this.position.x - obstacle.position.x1) ** 2 + (this.position.y - obstacle.position.y1) ** 2
        );

        if (intersection && distance <= CELL_SIZE * 2) {
          obstacleInViewIndex = i;
          obstacleInView = obstacle;
        }
      }

      if (
        !obstacleInViewIndex ||
        !obstacleInView ||
        this.hasEqualPosition(obstacleInView.position, obstacleInView.endPosition)
      ) {
        return;
      }

      this.currentlyMovingObstacles[obstacleInViewIndex] = obstacleInView;
    }
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.keyCode === 87 /* w */) {
      this.verticalSpeed = CAMERA_SPEED;
    } else if (event.keyCode === 83 /* s */) {
      this.verticalSpeed = -CAMERA_SPEED;
    } else if (event.keyCode === 68 /* d */) {
      this.horizontalSpeed = CAMERA_SPEED;
    } else if (event.keyCode === 65 /* a */) {
      this.horizontalSpeed = -CAMERA_SPEED;
    }
  }

  handleKeyUp(event: KeyboardEvent) {
    if (event.keyCode === 87 /* w */ || event.keyCode === 83 /* s */) {
      this.verticalSpeed = 0;
    } else if (event.keyCode === 68 /* d */ || event.keyCode === 65 /* a */) {
      this.horizontalSpeed = 0;
    }
  }

  hasEqualPosition(firstPosition: Vector, secondPosition: Vector) {
    return (
      firstPosition.x1 === secondPosition.x1 &&
      firstPosition.y1 === secondPosition.y1 &&
      firstPosition.x2 === secondPosition.x2 &&
      firstPosition.y2 === secondPosition.y2
    );
  }

  getNeighbors(obstacle: Vector) {
    const neighbors: Record<keyof typeof OBSTACLE_SIDES, null | PreparedNeighbor> = {
      [OBSTACLE_SIDES.TOP]: null,
      [OBSTACLE_SIDES.LEFT]: null,
      [OBSTACLE_SIDES.BOTTOM]: null,
      [OBSTACLE_SIDES.RIGHT]: null,
    };

    Object.keys(neighbors).forEach((side: keyof typeof OBSTACLE_SIDES, i) => {
      const offset = NEIGHBOR_OFFSET[side];

      const axisY = this.map[(obstacle.y1 + (i % 2 === 0 ? offset : 0)) / CELL_SIZE];

      if (axisY) {
        const axisXValue = axisY[(obstacle.x1 + (i % 2 === 0 ? 0 : offset)) / CELL_SIZE];

        if (axisXValue) {
          const isDoor = typeof axisXValue === 'number' && DOOR_IDS.includes(axisXValue);
          const isSecret = typeof axisXValue === 'string';

          neighbors[side] = {
            isDoor,
            isSecret,
            isMovable: isDoor || isSecret,
            number: typeof axisXValue === 'number' ? axisXValue : Number(axisXValue.split('_')[0]),
          };
        }
      }
    });

    return neighbors;
  }

  toRadians(angle: number) {
    return (angle * Math.PI) / 180;
  }

  getAreaSize(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) {
    return Math.abs((x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)) / 2.0);
  }

  // https://www.geeksforgeeks.org/check-whether-a-given-point-lies-inside-a-triangle-or-not/
  getIsVertexInTheTriangle({ x, y }: Vertex, { x1, y1, x2, y2, x3, y3 }: Triangle) {
    const abcArea = this.getAreaSize(x1, y1, x2, y2, x3, y3);
    const pbcArea = this.getAreaSize(x, y, x2, y2, x3, y3);
    const pacArea = this.getAreaSize(x1, y1, x, y, x3, y3);
    const pabArea = this.getAreaSize(x1, y1, x2, y2, x, y);

    return Math.round(abcArea) == Math.round(pbcArea + pacArea + pabArea);
  }

  getVertexByPositionAndAngle(position: Vertex, angle: number) {
    return {
      x: position.x + RAY_LENGTH * Math.sin(angle),
      y: position.y + RAY_LENGTH * Math.cos(angle),
    };
  }

  getWallVectorFromObstacle(obstacle: Obstacle, wallPosition: keyof typeof OBSTACLE_SIDES) {
    const obstaclePos = obstacle.position;
    const isDoor = obstacle.isDoor;

    return {
      x1: obstaclePos.x1 + (wallPosition === OBSTACLE_SIDES.RIGHT && !isDoor ? CELL_SIZE : 0),
      y1: obstaclePos.y1 + (wallPosition === OBSTACLE_SIDES.BOTTOM && !isDoor ? CELL_SIZE : 0),
      x2: obstaclePos.x2 - (wallPosition === OBSTACLE_SIDES.LEFT && !isDoor ? CELL_SIZE : 0),
      y2: obstaclePos.y2 - (wallPosition === OBSTACLE_SIDES.TOP && !isDoor ? CELL_SIZE : 0),
    };
  }

  getWallFromObstacle(
    obstacle: Obstacle,
    index: number,
    type: keyof typeof OBSTACLE_SIDES,
    neighbor: PreparedNeighbor
  ) {
    const isVertical = type === OBSTACLE_SIDES.TOP || type === OBSTACLE_SIDES.BOTTOM;

    let textureId = obstacle.textureId;

    if (neighbor?.isDoor) {
      textureId = isVertical ? 29 : 30;
    }

    return {
      position: this.getWallVectorFromObstacle(obstacle, type),
      type: isVertical ? INTERSECTION_TYPES.VERTICAL : INTERSECTION_TYPES.HORIZONTAL,
      shouldReverseTexture: !neighbor?.isDoor && (type === OBSTACLE_SIDES.LEFT || type === OBSTACLE_SIDES.BOTTOM),
      textureId: textureId,
      obstacleIdx: index,
      isMovable: obstacle.isMovable,
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

  getVisibleWalls() {
    const leftExtremumAngle = this.angle - FOV;
    const rightExtremumAngle = this.angle + FOV;

    const currentAngleRayEndVertex = this.getVertexByPositionAndAngle(this.position, this.angle);
    const leftFOVExtremumVertex = this.getVertexByPositionAndAngle(currentAngleRayEndVertex, leftExtremumAngle);
    const rightFOVExtremumVertex = this.getVertexByPositionAndAngle(currentAngleRayEndVertex, rightExtremumAngle);

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
    // push only those walls that can be visible by player side
    const visibleWalls = this.obstacles.reduce<Wall[]>((acc, obstacle, i) => {
      const obstaclePos = obstacle.position;
      const obstacleNeighbors = this.getNeighbors(obstaclePos);

      if (obstacle.isDoor) {
        const type = obstacle.isVertical ? OBSTACLE_SIDES.TOP : OBSTACLE_SIDES.LEFT;

        acc.push(this.getWallFromObstacle(obstacle, i, type, null));

        return acc;
      }

      if (this.position.x <= obstaclePos.x1 && (!obstacleNeighbors.LEFT || obstacleNeighbors.LEFT.isMovable)) {
        acc.push(this.getWallFromObstacle(obstacle, i, OBSTACLE_SIDES.LEFT, obstacleNeighbors.LEFT));
      }
      if (this.position.x >= obstaclePos.x2 && (!obstacleNeighbors.RIGHT || obstacleNeighbors.RIGHT.isMovable)) {
        acc.push(this.getWallFromObstacle(obstacle, i, OBSTACLE_SIDES.RIGHT, obstacleNeighbors.RIGHT));
      }
      if (this.position.y <= obstaclePos.y1 && (!obstacleNeighbors.TOP || obstacleNeighbors.TOP.isMovable)) {
        acc.push(this.getWallFromObstacle(obstacle, i, OBSTACLE_SIDES.TOP, obstacleNeighbors.TOP));
      }
      if (this.position.y >= obstaclePos.y2 && (!obstacleNeighbors.BOTTOM || obstacleNeighbors.BOTTOM.isMovable)) {
        acc.push(this.getWallFromObstacle(obstacle, i, OBSTACLE_SIDES.BOTTOM, obstacleNeighbors.BOTTOM));
      }

      return acc;
    }, []);

    // get walls that are in the ray length range
    const visibleWallsByLength = visibleWalls.filter(
      (wall) =>
        wall.position.y1 >= lengthBoundaries.y1 &&
        wall.position.x1 >= lengthBoundaries.x1 &&
        wall.position.x2 <= lengthBoundaries.x2 &&
        wall.position.y2 <= lengthBoundaries.y2
    );

    // get walls that are in the FOV range
    const visibleWallsByRange = visibleWallsByLength.filter((wall) => {
      // If user comes straight to the wall, vertexes of the wall will not be in range of vision
      // so we need to check if user looking at the wall rn
      const isLookingAt = !!this.getViewAngleIntersection(wall.position);

      const { x1, y1, x2, y2 } = wall.position;

      return (
        isLookingAt ||
        this.getIsVertexInTheTriangle({ x: x1, y: y1 }, rangeBoundaries) ||
        this.getIsVertexInTheTriangle({ x: x2, y: y2 }, rangeBoundaries)
      );
    });

    return {
      byLength: visibleWallsByLength,
      byRange: visibleWallsByRange,
    };
  }

  getChange(startPosition: number, endPosition: number) {
    if (startPosition > endPosition) {
      return -OBSTACLES_MOVE_SPEED;
    } else if (startPosition < endPosition) {
      return OBSTACLES_MOVE_SPEED;
    }

    return 0;
  }

  moveObstacles() {
    Object.keys(this.currentlyMovingObstacles).forEach((key) => {
      const obstacle = this.obstacles[Number(key)];

      this.obstacles[Number(key)].position = {
        x1: obstacle.position.x1 + this.getChange(obstacle.position.x1, obstacle.endPosition.x1),
        y1: obstacle.position.y1 + this.getChange(obstacle.position.y1, obstacle.endPosition.y1),
        x2: obstacle.position.x2 + this.getChange(obstacle.position.x2, obstacle.endPosition.x2),
        y2: obstacle.position.y2 + this.getChange(obstacle.position.y2, obstacle.endPosition.y2),
      };

      if (
        obstacle.position.x1 === obstacle.endPosition.x1 &&
        obstacle.position.y1 === obstacle.endPosition.y1 &&
        obstacle.position.x2 === obstacle.endPosition.x2 &&
        obstacle.position.y2 === obstacle.endPosition.y2
      ) {
        delete this.currentlyMovingObstacles[Number(key)];
      }
    });
  }

  move() {
    if (this.horizontalSpeed === 0 && this.verticalSpeed === 0) {
      return;
    }

    const position = { x: this.position.x, y: this.position.y };

    const verticalChangeX = Math.sin(this.angle) * this.verticalSpeed;
    const verticalChangeY = Math.cos(this.angle) * this.verticalSpeed;

    const horizontalChangeX = Math.sin(this.angle + Math.PI / 2) * this.horizontalSpeed;
    const horizontalChangeY = Math.cos(this.angle + Math.PI / 2) * this.horizontalSpeed;

    const xSum = verticalChangeX + horizontalChangeX;
    const ySum = verticalChangeY + horizontalChangeY;

    position.x += xSum >= 0 ? Math.min(xSum, CAMERA_SPEED) : Math.max(xSum, -CAMERA_SPEED);
    position.y += ySum >= 0 ? Math.min(ySum, CAMERA_SPEED) : Math.max(ySum, -CAMERA_SPEED);

    for (let wall of this.visibleWalls.byLength) {
      if (
        this.position.y >= wall.position.y1 &&
        this.position.y <= wall.position.y2 &&
        ((position.x >= wall.position.x1 && this.position.x <= wall.position.x1) ||
          (position.x <= wall.position.x1 && this.position.x >= wall.position.x1))
      ) {
        position.x = this.position.x;
      }

      if (
        this.position.x >= wall.position.x1 &&
        this.position.x <= wall.position.x2 &&
        ((position.y >= wall.position.y1 && this.position.y <= wall.position.y1) ||
          (position.y <= wall.position.y1 && this.position.y >= wall.position.y1))
      ) {
        position.y = this.position.y;
      }
    }

    for (let i = 0; i < this.rays.length; i++) {
      this.rays[i].move(position);
    }

    this.position = position;
  }

  renderAndGetIntersections() {
    let intersections = [];

    this.ctx.strokeStyle = 'orange';
    this.ctx.beginPath();

    this.moveObstacles();
    this.move();

    this.visibleWalls = this.getVisibleWalls();

    for (let ray of this.rays) {
      const intersection = ray.cast(this.visibleWalls.byRange);
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
    this.angle += this.toRadians(event.movementX / 2);

    const initialAngle = this.angle - FOV / 2;
    const step = FOV / this.rays.length;

    for (let i = 0; i < this.rays.length; i++) {
      this.rays[i].changeAngle(initialAngle + i * step, this.angle);
    }
  }
}
