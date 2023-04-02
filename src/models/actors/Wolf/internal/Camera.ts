import { DEFAULT_FOV, DEFAULT_RESOLUTION_SCALE, OBSTACLE_SIDES } from 'src/constants/config';

import { getNeighbors } from 'src/helpers/getNeighbors';
import { getRelativeChunkMultiplier } from 'src/helpers/getRelativeChunkMultiplier';
import { getIntersectionVertexWithPlane, getVertexByPositionAndAngle, toRadians } from 'src/helpers/maths';

import { Ray } from './Ray';
import { canvas } from 'src/main';

import type { IndexedIntersection, Obstacle, ParsedMap, Vector, Vertex } from 'src/types';
import { isItem, isSprite, isWall } from 'src/types/typeGuards';

type CameraParams = {
  position: Camera['_position'];
  raysAmount: number;
};

/** @internal for Wolf.ts */
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
      const nonGridCastResult = this._rays[i].cast(nonGridPlanes);

      // calculate non grid intersections
      nonGridCastResult.forEach(({ obstacle, intersectionVertex, distance }) => {
        const relativeChunkMultiplier = getRelativeChunkMultiplier(distance);

        intersections.push({
          intersectionVertex,
          obstacle,
          distance: Math.round(distance * relativeChunkMultiplier) / relativeChunkMultiplier,
          index: i,
        });
      });

      // calculate grid intersections
      this._rays[i].castDDA(parsedMap).forEach(({ obstacle, intersectionVertex, distance }) => {
        const obstaclePos = obstacle.position;

        const relativeChunkMultiplier = getRelativeChunkMultiplier(distance);

        let preparedIntersection = intersectionVertex;
        let preparedDistance = Math.round(distance * relativeChunkMultiplier) / relativeChunkMultiplier;

        const obstacleNeighbors = getNeighbors(parsedMap, obstacle.matrixCoordinates);

        let intersectedObstacle: Obstacle | null = null;

        if (isSprite(obstacle) || isItem(obstacle)) {
          intersectedObstacle = obstacle.rotatePerpendicularlyToView(this._angle);

          const castResult = this._rays[i].cast([intersectedObstacle]);

          const closest = castResult.sort(
            ({ distance: distanceA }, { distance: distanceB }) => distanceB - distanceA
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
            intersectedObstacle = obstacle.getWallBySide(OBSTACLE_SIDES.LEFT, obstacleNeighbors.LEFT);
          }
          if (preparedIntersection.y !== obstaclePos.y1 && preparedIntersection.x === obstaclePos.x2) {
            intersectedObstacle = obstacle.getWallBySide(OBSTACLE_SIDES.RIGHT, obstacleNeighbors.RIGHT);
          }
          if (preparedIntersection.y === obstaclePos.y1 && preparedIntersection.x !== obstaclePos.x1) {
            intersectedObstacle = obstacle.getWallBySide(OBSTACLE_SIDES.TOP, obstacleNeighbors.TOP);
          }
          if (preparedIntersection.y === obstaclePos.y2 && preparedIntersection.x !== obstaclePos.x1) {
            intersectedObstacle = obstacle.getWallBySide(OBSTACLE_SIDES.BOTTOM, obstacleNeighbors.BOTTOM);
          }
        }

        if (intersectedObstacle) {
          intersections.push({
            obstacle: intersectedObstacle,
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
          cameraAngle: this._angle,
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

      this._rays[i].changeAngle(rayAngle, this._angle);
    }
  }
}
