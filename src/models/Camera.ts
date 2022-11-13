class Camera {
  private readonly ctx: CanvasRenderingContext2D;

  private rays: Ray[];
  private position: Vertex;

  public angle: number;

  constructor(position: Camera['position'], raysAmount: number, ctx: Camera['ctx']) {
    this.angle = this.toRadians(180);
    this.ctx = ctx;
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

  // rounding for chunk rendering, Math.round(distance * multiplier) / multiplier, same distance on multiple rays means
  // that we can render these rays in 1 iteration that saves a lot of resources
  // less = more performance, more artifacts
  getRelativeChunkMultiplier = (distance: number) => {
    let relativeChunkMultiplier;

    if (distance < TILE_SIZE / 2) {
      relativeChunkMultiplier = 32;
    } else if (distance < TILE_SIZE * 3) {
      relativeChunkMultiplier = 16;
    } else if (distance < TILE_SIZE * 6) {
      relativeChunkMultiplier = 8;
    } else {
      relativeChunkMultiplier = 1;
    }

    return relativeChunkMultiplier;
  };

  getIntersections(gameMap: (Obstacle | null)[][], nonGridPlanes: Plane[]): IndexedIntersection[] {
    const intersections: IndexedIntersection[] = [];

    for (let i = 0; i < this.rays.length; i++) {
      const nonGridCastResult = this.rays[i].cast(nonGridPlanes);

      if (nonGridCastResult) {
        const relativeChunkMultiplier = this.getRelativeChunkMultiplier(nonGridCastResult.distance);

        intersections.push({
          ...nonGridCastResult,
          distance: Math.round(nonGridCastResult.distance * relativeChunkMultiplier) / relativeChunkMultiplier,
          index: i,
        });
      }

      this.rays[i].castDDA(gameMap).forEach(({ obstacle, intersectionVertex, distance }) => {
        const obstaclePos = obstacle.position;

        const relativeChunkMultiplier = this.getRelativeChunkMultiplier(distance);

        let preparedIntersection = intersectionVertex;
        let preparedDistance = Math.round(distance * relativeChunkMultiplier) / relativeChunkMultiplier;

        const obstacleNeighbors = obstacle.getNeighbors(gameMap);

        let plane = null;

        if (obstacle.isSprite) {
          plane = obstacle.getSpriteFromObstacle(obstacle, this.angle);

          const castResult = this.rays[i].cast([plane]);

          if (castResult) {
            preparedDistance = Math.round(castResult.distance * relativeChunkMultiplier) / relativeChunkMultiplier;
            preparedIntersection = castResult.intersectionVertex;
          } else {
            return;
          }
        } else {
          if (preparedIntersection.y !== obstaclePos.y1 && preparedIntersection.x === obstaclePos.x1) {
            plane = obstacle.getWallFromObstacle(obstacle, OBSTACLE_SIDES.LEFT, obstacleNeighbors.LEFT);
          }
          if (preparedIntersection.y !== obstaclePos.y1 && preparedIntersection.x === obstaclePos.x2) {
            plane = obstacle.getWallFromObstacle(obstacle, OBSTACLE_SIDES.RIGHT, obstacleNeighbors.RIGHT);
          }
          if (preparedIntersection.y === obstaclePos.y1 && preparedIntersection.x !== obstaclePos.x1) {
            plane = obstacle.getWallFromObstacle(obstacle, OBSTACLE_SIDES.TOP, obstacleNeighbors.TOP);
          }
          if (preparedIntersection.y === obstaclePos.y2 && preparedIntersection.x !== obstaclePos.x1) {
            plane = obstacle.getWallFromObstacle(obstacle, OBSTACLE_SIDES.BOTTOM, obstacleNeighbors.BOTTOM);
          }
        }

        if (plane) {
          intersections.push({
            plane: plane,
            distance: preparedDistance,
            index: i,
            intersectionVertex: preparedIntersection,
          });
        }
      });
    }

    return intersections;
  }

  changeRaysAmount(raysAmount: number) {
    this.rays = [];

    // you are my hero https://stackoverflow.com/a/55247059/17420897
    const trueRaysAmount = Math.floor(raysAmount * RESOLUTION_SCALE);
    const screenHalfLength = Math.tan(FOV / 2);
    const segmentLength = screenHalfLength / (trueRaysAmount / 2);

    for (let i = 0; i < trueRaysAmount; i++) {
      let rayAngle = this.angle + Math.atan(segmentLength * i - screenHalfLength);

      if (rayAngle < 0) {
        rayAngle += Math.PI * 2;
      }

      if (rayAngle > Math.PI * 2) {
        rayAngle -= Math.PI * 2;
      }

      this.rays.push(new Ray(this.position, rayAngle, this.angle));
    }
  }

  rotate(event: MouseEvent) {
    this.angle += this.toRadians(event.movementX / 3);

    this.angle = this.angle % (2 * Math.PI);

    if (this.angle < 0) {
      this.angle += 2 * Math.PI;
    }

    const screenHalfLength = Math.tan(FOV / 2);
    const segmentLength = screenHalfLength / ((Math.floor(this.rays.length / 10) * 10) / 2);

    for (let i = 0; i < this.rays.length; i++) {
      let rayAngle = this.angle + Math.atan(segmentLength * i - screenHalfLength);

      if (rayAngle < 0) {
        rayAngle += Math.PI * 2;
      }

      if (rayAngle > Math.PI * 2) {
        rayAngle -= Math.PI * 2;
      }

      this.rays[i].changeAngle(rayAngle, this.angle);
    }
  }
}
