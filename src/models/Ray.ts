import { Intersection, Obstacle, Vector, Vertex } from '../types';
import { isDoor, isItem, isMovableEntity, isSprite } from '../types/typeGuards';
import { RAY_LENGTH, TILE_SIZE } from '../constants/config';
import { getIntersectionVertexWithPlane, unitVector } from '../helpers/maths';

export class Ray {
  private angle: number;
  private cameraAngle: number;
  private cameraPosition: Vector;

  constructor(position: Vertex, angle: Ray['angle'], cameraAngle: Ray['cameraAngle']) {
    this.angle = angle;
    this.cameraAngle = cameraAngle;
    this.cameraPosition = {
      x1: 0,
      y1: 0,
      x2: 0,
      y2: 0,
    };

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

  castDDA(
    RawMap: (Obstacle | null)[][]
  ): {
    obstacle: Obstacle;
    distance: number;
    intersectionVertex: Vertex;
  }[] {
    const intersections = [];

    const directionVector = unitVector({
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
        if (RawMap[currentMapPosition.y] && RawMap[currentMapPosition.y][currentMapPosition.x]) {
          const intersectedObstacle = RawMap[currentMapPosition.y][currentMapPosition.x]!;

          if (isDoor(intersectedObstacle) || (isMovableEntity(intersectedObstacle) && intersectedObstacle.isMoving)) {
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

          if (isSprite(intersectedObstacle) || isItem(intersectedObstacle)) {
            continue;
          }

          return intersections;
        }
      }
    }

    return intersections;
  }

  cast(obstacles: Obstacle[]): Intersection<Obstacle> | null {
    let intersections: { vertex: Vertex; obstacle: Obstacle }[] = [];

    for (let obstacle of obstacles) {
      const intersection = getIntersectionVertexWithPlane(this.cameraPosition, obstacle.position);

      if (intersection) {
        intersections.push({
          vertex: intersection,
          obstacle,
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
        obstacle: closestIntersection.obstacle,
        distance: this.fixFishEye(closestDistance),
      };
    }

    return null;
  }
}
