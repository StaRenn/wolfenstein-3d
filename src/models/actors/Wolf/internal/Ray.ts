import { RAY_LENGTH, TILE_SIZE } from 'src/constants/config';

import { getIntersectionVertexWithPlane, unitVector } from 'src/helpers/maths';

import type { Intersection, Obstacle, ParsedMap, Vector, Vertex } from 'src/types';
import { isDoor, isMovableEntity, isSprite } from 'src/types/typeGuards';

type RayParams = {
  angle: Ray['_angle'];
  cameraAngle: Ray['_cameraAngle'];
  initialPosition: Vertex;
};

/** @internal for Camera.ts */
export class Ray {
  private _angle: number;
  private _cameraAngle: number;
  private _cameraPosition: Vector;

  constructor(params: RayParams) {
    this._angle = params.angle;
    this._cameraAngle = params.cameraAngle;
    this._cameraPosition = {
      x1: 0,
      y1: 0,
      x2: 0,
      y2: 0,
    };

    this.move(params.initialPosition);
  }

  changeAngle(angle: Ray['_angle'], cameraAngle: Ray['_cameraAngle']) {
    this._cameraAngle = cameraAngle;
    this._angle = angle;

    this.move({ x: this._cameraPosition.x1, y: this._cameraPosition.y1 });
  }

  fixFishEye(distance: number) {
    return distance * Math.cos(this._angle - this._cameraAngle);
  }

  getDistance(vertex: Vertex) {
    return Math.sqrt((vertex.x - this._cameraPosition.x1) ** 2 + (vertex.y - this._cameraPosition.y1) ** 2);
  }

  move(position: Vertex) {
    this._cameraPosition = {
      x1: position.x,
      y1: position.y,
      x2: position.x + Math.sin(this._angle) * RAY_LENGTH,
      y2: position.y + Math.cos(this._angle) * RAY_LENGTH,
    };
  }

  // optimized casting algorithm, used for obstacles that use map grid
  // https://www.youtube.com/watch?v=NbSee-XM7WA
  castDDA(parsedMap: ParsedMap): Intersection<Obstacle>[] {
    const intersections = [];

    const directionVector = unitVector({
      x: this._cameraPosition.x2 - this._cameraPosition.x1,
      y: this._cameraPosition.y2 - this._cameraPosition.y1,
    });

    const currentPlayerPosition: Vertex = {
      x: this._cameraPosition.x1 / TILE_SIZE,
      y: this._cameraPosition.y1 / TILE_SIZE,
    };

    const currentMapPosition: Vertex = {
      x: Math.floor(this._cameraPosition.x1 / TILE_SIZE),
      y: Math.floor(this._cameraPosition.y1 / TILE_SIZE),
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
        if (parsedMap[currentMapPosition.y] && parsedMap[currentMapPosition.y][currentMapPosition.x]) {
          const intersectedObstacle = parsedMap[currentMapPosition.y][currentMapPosition.x]!;

          if (isDoor(intersectedObstacle) || (isMovableEntity(intersectedObstacle) && intersectedObstacle.isMoving)) {
            continue;
          }

          const intersectionPoint: Vertex = {
            x: currentPlayerPosition.x * TILE_SIZE + directionVector.x * distance * TILE_SIZE,
            y: currentPlayerPosition.y * TILE_SIZE + directionVector.y * distance * TILE_SIZE,
          };

          intersectionPoint[intersectionOrigin] = Math.round(intersectionPoint[intersectionOrigin]);

          const fixedDistance = this.fixFishEye(distance * TILE_SIZE);

          if (fixedDistance > TILE_SIZE / 5 || !isSprite(intersectedObstacle)) {
            intersections.push({
              obstacle: intersectedObstacle,
              distance: fixedDistance,
              intersectionVertex: intersectionPoint,
            });
          }

          if (isSprite(intersectedObstacle)) {
            continue;
          }

          return intersections;
        }
      }
    }

    return intersections;
  }

  // non-optimized casting algorithm, used for obstacles that DON'T use map grid
  cast(obstacles: Obstacle[]): Intersection<Obstacle>[] {
    let intersections: Intersection<Obstacle>[] = [];

    for (let obstacle of obstacles) {
      const intersectionVertex = getIntersectionVertexWithPlane(this._cameraPosition, obstacle.position);

      if (intersectionVertex) {
        const distance = this.fixFishEye(this.getDistance(intersectionVertex));

        // if sprite too close to player, dont count it as intersection
        if (distance > TILE_SIZE / 5 || !isSprite(obstacle)) {
          intersections.push({
            intersectionVertex,
            distance,
            obstacle,
          });
        }
      }
    }

    return intersections;
  }
}
