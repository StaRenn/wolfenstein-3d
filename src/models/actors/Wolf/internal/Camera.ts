import { DEFAULT_FOV, DEFAULT_RESOLUTION_SCALE } from 'src/constants/config';

import { getRelativeChunkMultiplier } from 'src/helpers/getRelativeChunkMultiplier';
import { getIntersectionVertexWithPlane, getVertexByPositionAndAngle, toRadians } from 'src/helpers/maths';

import { Ray } from './Ray';
import { canvas } from 'src/main';

import type { IndexedIntersection, Intersection, Obstacle, ParsedMap, Vector, Vertex } from 'src/types';
import { isItem, isSprite, isWall } from 'src/types/typeGuards';

type CameraParams = {
  position: Camera['_position'];
  raysAmount: number;
};

/** @internal for Wolf.ts and Enemy.ts */
export class Camera {
  private _rays: Ray[];
  private _position: Vertex;
  private _angle: number;
  private _resolutionScale: number;
  private _fov: number;

  constructor(params: CameraParams) {
    this._angle = toRadians(180);
    this._resolutionScale = DEFAULT_RESOLUTION_SCALE;
    this._fov = DEFAULT_FOV;

    this._position = params.position;
    this._rays = [];

    canvas.addEventListener('mousemove', this.rotate.bind(this));

    this.changeRaysAmount(params.raysAmount);
  }

  set resolutionScale(scale: number) {
    this._resolutionScale = scale;
  }

  set fov(newFov: number) {
    this._fov = newFov;
  }

  get resolutionScale() {
    return this._resolutionScale;
  }

  get fov() {
    return this._fov;
  }

  get angle() {
    return this._angle;
  }

  updatePosition(position: Camera['_position']) {
    for (let i = 0; i < this._rays.length; i++) {
      this._rays[i].move(position);
    }

    this._position = position;
  }

  // get intersection vertex from camera angle to obstacle
  getViewAngleIntersection(position: Vector) {
    const currentAngleRayEndVertex = getVertexByPositionAndAngle(this._position, this._angle);

    return getIntersectionVertexWithPlane(
      {
        x1: this._position.x,
        y1: this._position.y,
        x2: currentAngleRayEndVertex.x,
        y2: currentAngleRayEndVertex.y,
      },
      position
    );
  }

  getIntersections(parsedMap: ParsedMap, nonGridPlanes: Obstacle[]): IndexedIntersection<Obstacle>[] {
    const intersections: IndexedIntersection<Obstacle>[] = [];

    for (let i = 0; i < this._rays.length; i++) {
      let currentIntersections: IndexedIntersection<Obstacle>[] = []

      let nonGridCastResult = this._rays[i].cast(nonGridPlanes, this._angle);
      const gridCastResult = this._rays[i].castDDA(parsedMap, this._angle);

      const closestNonHollowGridCast = gridCastResult.reduce<Intersection<Obstacle> | null>((acc, intersection) => {
        if(!acc && isWall(intersection.obstacle)) {
          acc = intersection
        } else if(acc && isWall(intersection.obstacle) && intersection.distance < acc.distance) {
          acc = intersection
        }

        return acc
      }, null);

      if (closestNonHollowGridCast) {
        nonGridCastResult = nonGridCastResult.filter((castResult) => castResult.distance < closestNonHollowGridCast.distance);
      }

      // calculate non grid intersections
      nonGridCastResult.forEach(({ obstacle, intersectionVertex, distance }) => {
        const relativeChunkMultiplier = isSprite(obstacle) ? 4 : getRelativeChunkMultiplier(distance);
        const preparedDistance = Math.round(distance * relativeChunkMultiplier) / relativeChunkMultiplier;

        const intersectionsAmountWithSameDistance = currentIntersections.reduce((acc,intersection) => {
          if(intersection.distance === preparedDistance) {
            acc += 1;
          }

          return acc
        }, 0)

        currentIntersections.push({
          intersectionVertex,
          obstacle,
          distance: Math.round(distance * relativeChunkMultiplier) / relativeChunkMultiplier,
          index: i,
          layer: intersectionsAmountWithSameDistance
        });
      });

      gridCastResult.forEach(({ obstacle, intersectionVertex, distance }) => {
        const obstaclePos = obstacle.position;

        const relativeChunkMultiplier = isSprite(obstacle) ? 4 : getRelativeChunkMultiplier(distance);

        let preparedIntersection = intersectionVertex;
        let preparedDistance = Math.round(distance * relativeChunkMultiplier) / relativeChunkMultiplier;

        let intersectedObstacle: Obstacle | null = null;

        if (isSprite(obstacle) || isItem(obstacle)) {
          intersectedObstacle = obstacle.rotatePerpendicularlyToView(this._angle);

          const castResult = this._rays[i].cast([intersectedObstacle], this._angle);

          const closest = castResult.sort(
            ({ distance: distanceA }, { distance: distanceB }) => distanceA - distanceB
          )[0];

          if (closest) {
            preparedDistance = Math.round(closest.distance * relativeChunkMultiplier) / relativeChunkMultiplier;
            preparedIntersection = closest.intersectionVertex;
          } else {
            return;
          }
        } else if (isWall(obstacle)) {
          // from grid cast result we get unprepared wall obstacle (with diagonal vector that represents 4 walls)
          // we need to get wall side with prepared position
          if (preparedIntersection.y !== obstaclePos.y1 && preparedIntersection.x === obstaclePos.x1) {
            intersectedObstacle = obstacle.wallSides.LEFT;
          }
          if (preparedIntersection.y !== obstaclePos.y1 && preparedIntersection.x === obstaclePos.x2) {
            intersectedObstacle = obstacle.wallSides.RIGHT;
          }
          if (preparedIntersection.y === obstaclePos.y1 && preparedIntersection.x !== obstaclePos.x1) {
            intersectedObstacle = obstacle.wallSides.TOP;
          }
          if (preparedIntersection.y === obstaclePos.y2 && preparedIntersection.x !== obstaclePos.x1) {
            intersectedObstacle = obstacle.wallSides.BOTTOM;
          }
        }

        if (intersectedObstacle) {
          const intersectionsAmountWithSameDistance = currentIntersections.reduce((acc,intersection) => {
            if(intersection.distance === preparedDistance) {
              acc += 1;
            }

            return acc
          }, 0)

          currentIntersections.push({
            obstacle: intersectedObstacle,
            distance: preparedDistance,
            index: i,
            intersectionVertex: preparedIntersection,
            layer: intersectionsAmountWithSameDistance
          });
        }
      });

      intersections.push(...currentIntersections)
    }

    return intersections;
  }

  changeRaysAmount(raysAmount: number) {
    this._rays = [];

    // you are my hero https://stackoverflow.com/a/55247059/17420897
    const trueRaysAmount = Math.floor(raysAmount * this._resolutionScale);
    const screenHalfLength = Math.tan(this._fov / 2);
    const segmentLength = screenHalfLength / (trueRaysAmount / 2);

    for (let i = 0; i < trueRaysAmount; i++) {
      let rayAngle = this._angle + Math.atan(segmentLength * i - screenHalfLength);

      if (rayAngle < 0) {
        rayAngle += Math.PI * 2;
      }

      if (rayAngle > Math.PI * 2) {
        rayAngle -= Math.PI * 2;
      }

      this._rays.push(
        new Ray({
          angle: rayAngle,
          initialPosition: this._position,
        })
      );
    }
  }

  private rotate(event: MouseEvent) {
    this._angle += toRadians(event.movementX / 3);

    this._angle = this._angle % (2 * Math.PI);

    if (this._angle < 0) {
      this._angle += 2 * Math.PI;
    }

    const screenHalfLength = Math.tan(this._fov / 2);
    const segmentLength = screenHalfLength / ((Math.floor(this._rays.length / 10) * 10) / 2);

    // rotate all rays on camera move
    for (let i = 0; i < this._rays.length; i++) {
      let rayAngle = this._angle + Math.atan(segmentLength * i - screenHalfLength);

      if (rayAngle < 0) {
        rayAngle += Math.PI * 2;
      }

      if (rayAngle > Math.PI * 2) {
        rayAngle -= Math.PI * 2;
      }

      this._rays[i].changeAngle(rayAngle);
    }
  }
}
