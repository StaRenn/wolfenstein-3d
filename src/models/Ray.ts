class Ray {
  private angle: number;
  private cameraAngle: number;
  private cameraPosition: Vector;

  constructor(position: Vertex, angle: Ray['angle'], cameraAngle: Ray['cameraAngle']) {
    this.angle = angle;
    this.cameraAngle = cameraAngle;

    this.move(position);
  }

  changeAngle(angle: Ray['angle'], cameraAngle: Ray['cameraAngle']) {
    this.cameraAngle = cameraAngle;
    this.angle = angle;

    this.move({ x: this.cameraPosition.x1, y: this.cameraPosition.y1 });
  }

  fixFishEye(distance: number) {
    return distance * Math.cos(this.angle - this.cameraAngle);
  }

  static getIntersectionVertexWithPlane(firstVector: Vector, secondVector: Vector) {
    const { x1, x2, y1, y2 } = firstVector;
    const { x1: x3, y1: y3, x2: x4, y2: y4 } = secondVector;

    // Check if none of the lines are of length 0
    if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
      return;
    }

    const denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);

    // Lines are parallel
    if (denominator === 0) {
      return;
    }

    let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
    let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;

    // is the intersection along the segments
    if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
      return;
    }

    // Return a object with the x and y coordinates of the intersection
    let x = x1 + ua * (x2 - x1);
    let y = y1 + ua * (y2 - y1);

    return { x, y };
  }

  getDistance(vertex: Vertex) {
    return Math.sqrt((vertex.x - this.cameraPosition.x1) ** 2 + (vertex.y - this.cameraPosition.y1) ** 2);
  }

  move(position: Vertex) {
    this.cameraPosition = {
      x1: position.x,
      y1: position.y,
      x2: position.x + Math.sin(this.angle) * RAY_LENGTH,
      y2: position.y + Math.cos(this.angle) * RAY_LENGTH,
    };
  }

  vectorSize({ x, y }: Vertex) {
    return Math.sqrt(x * x + y * y);
  }

  unitVector({ x, y }: Vertex) {
    const magnitude = this.vectorSize({ x, y });
    // We need to return a vector here, so we return an array of coordinates:
    return { x: x / magnitude, y: y / magnitude };
  }

  castDDA(
    gameMap: (Obstacle | null)[][]
  ): {
    obstacle: Obstacle;
    distance: number;
    intersectionVertex: Vertex;
  }[] {
    const intersections = [];

    const directionVector = this.unitVector({
      x: this.cameraPosition.x2 - this.cameraPosition.x1,
      y: this.cameraPosition.y2 - this.cameraPosition.y1,
    });

    const currentPlayerPosition: Vertex = {
      x: this.cameraPosition.x1 / TILE_SIZE,
      y: this.cameraPosition.y1 / TILE_SIZE,
    };

    const currentMapPosition: Vertex = {
      x: Math.floor(this.cameraPosition.x1 / TILE_SIZE),
      y: Math.floor(this.cameraPosition.y1 / TILE_SIZE),
    };

    const stepLengthX = Math.abs(1 / directionVector.x);
    const stepLengthY = Math.abs(1 / directionVector.y);

    let rayLengthX;
    let rayLengthY;

    let stepX = 1;
    let stepY = 1;

    if (directionVector.x < 0) {
      stepX = -1;
      rayLengthX = (currentPlayerPosition.x - currentMapPosition.x) * stepLengthX;
    } else {
      rayLengthX = (currentMapPosition.x + 1 - currentPlayerPosition.x) * stepLengthX;
    }

    if (directionVector.y < 0) {
      stepY = -1;
      rayLengthY = (currentPlayerPosition.y - currentMapPosition.y) * stepLengthY;
    } else {
      rayLengthY = (currentMapPosition.y + 1 - currentPlayerPosition.y) * stepLengthY;
    }

    let intersectionOrigin: 'x' | 'y' = 'x';
    let distance = 0;

    while (distance < RAY_LENGTH / TILE_SIZE) {
      if (rayLengthX < rayLengthY) {
        currentMapPosition.x += stepX;
        distance = rayLengthX;
        rayLengthX += stepLengthX;
        intersectionOrigin = 'x';
      } else {
        currentMapPosition.y += stepY;
        distance = rayLengthY;
        rayLengthY += stepLengthY;
        intersectionOrigin = 'y';
      }

      if (
        currentMapPosition.x >= 0 &&
        currentMapPosition.x < 64 &&
        currentMapPosition.y >= 0 &&
        currentMapPosition.y < 64
      ) {
        if (gameMap[currentMapPosition.y] && gameMap[currentMapPosition.y][currentMapPosition.x]) {
          const intersectedObstacle = gameMap[currentMapPosition.y][currentMapPosition.x]!;

          if (intersectedObstacle.isDoor || intersectedObstacle.isMoving) {
            continue;
          }

          const intersectionPoint: Vertex = {
            x: currentPlayerPosition.x * TILE_SIZE + directionVector.x * distance * TILE_SIZE,
            y: currentPlayerPosition.y * TILE_SIZE + directionVector.y * distance * TILE_SIZE,
          };

          intersectionPoint[intersectionOrigin] = Math.round(intersectionPoint[intersectionOrigin]);

          intersections.push({
            obstacle: intersectedObstacle,
            distance: this.fixFishEye(distance * TILE_SIZE),
            intersectionVertex: intersectionPoint,
          });

          if (intersectedObstacle.isSprite) {
            continue;
          }

          return intersections;
        }
      }
    }

    return intersections;
  }

  cast(planes: Plane[]): Intersection | null {
    let intersections: { vertex: Vertex; plane: Plane }[] = [];

    for (let plane of planes) {
      const intersection = Ray.getIntersectionVertexWithPlane(this.cameraPosition, plane.position);

      if (intersection) {
        intersections.push({
          vertex: intersection,
          plane,
        });
      }
    }

    if (intersections.length > 0) {
      let closestIntersection = intersections[0];

      const closestDistance = intersections.reduce((acc, intersection) => {
        const currentDistance = this.getDistance(intersection.vertex);

        if (acc > currentDistance) {
          closestIntersection = intersection;
          return currentDistance;
        }

        return acc;
      }, Infinity);

      return {
        intersectionVertex: closestIntersection.vertex,
        plane: closestIntersection.plane,
        distance: this.fixFishEye(closestDistance),
      };
    }

    return null;
  }
}
