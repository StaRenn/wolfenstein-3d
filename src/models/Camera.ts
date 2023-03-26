import { IndexedIntersection, Obstacle, Vector, Vertex } from '../types';
import { Ray } from './Ray';
import { isItem, isSprite, isWall } from '../types/typeGuards';
import { getNeighbors } from '../helpers/getNeighbors';
import { canvas } from '../main';
import { OBSTACLE_SIDES } from '../constants/config';
import { getRelativeChunkMultiplier } from '../helpers/getRelativeChunkMultiplier';
import { getIntersectionVertexWithPlane, getVertexByPositionAndAngle, toRadians } from '../helpers/maths';

export class Camera {
  private readonly ctx: CanvasRenderingContext2D;

  private rays: Ray[];
  private position: Vertex;

  private _angle: number;

  constructor(position: Camera['position'], raysAmount: number, ctx: Camera['ctx']) {
    this._angle = toRadians(180);
    this.ctx = ctx;
    this.position = position;
    this.rays = [];

    canvas.addEventListener('mousemove', this.rotate.bind(this));

    this.changeRaysAmount(raysAmount);
  }

  get angle() {
    return this._angle;
  }

  updatePosition(position: Camera['position']) {
    for (let i = 0; i < this.rays.length; i++) {
      this.rays[i].move(position);
    }

    this.position = position;
  }

  getViewAngleIntersection(position: Vector) {
    const currentAngleRayEndVertex = getVertexByPositionAndAngle(this.position, this.angle);

    return getIntersectionVertexWithPlane(
      {
        x1: this.position.x,
        y1: this.position.y,
        x2: currentAngleRayEndVertex.x,
        y2: currentAngleRayEndVertex.y,
      },
      position
    );
  }

  getIntersections(RawMap: (Obstacle | null)[][], nonGridPlanes: Obstacle[]): IndexedIntersection<Obstacle>[] {
    const intersections: IndexedIntersection<Obstacle>[] = [];

    for (let i = 0; i < this.rays.length; i++) {
      const nonGridCastResult = this.rays[i].cast(nonGridPlanes);

      if (nonGridCastResult) {
        const relativeChunkMultiplier = getRelativeChunkMultiplier(nonGridCastResult.distance);

        intersections.push({
          ...nonGridCastResult,
          distance: Math.round(nonGridCastResult.distance * relativeChunkMultiplier) / relativeChunkMultiplier,
          index: i,
        });
      }

      this.rays[i].castDDA(RawMap).forEach(({ obstacle, intersectionVertex, distance }) => {
        const obstaclePos = obstacle.position;

        const relativeChunkMultiplier = getRelativeChunkMultiplier(distance);

        let preparedIntersection = intersectionVertex;
        let preparedDistance = Math.round(distance * relativeChunkMultiplier) / relativeChunkMultiplier;

        const obstacleNeighbors = getNeighbors(RawMap, obstacle.matrixCoordinates);

        let intersectedObstacle = null;

        if (isSprite(obstacle) || isItem(obstacle)) {
          intersectedObstacle = obstacle.getRotatedPerpendicularlyToViewPosition(this.angle);

          const castResult = this.rays[i].cast([intersectedObstacle]);

          if (castResult) {
            preparedDistance = Math.round(castResult.distance * relativeChunkMultiplier) / relativeChunkMultiplier;
            preparedIntersection = castResult.intersectionVertex;
          } else {
            return;
          }
        } else if (isWall(obstacle)) {
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

  private rotate(event: MouseEvent) {
    this._angle += toRadians(event.movementX / 3);

    this._angle = this._angle % (2 * Math.PI);

    if (this._angle < 0) {
      this._angle += 2 * Math.PI;
    }

    const screenHalfLength = Math.tan(FOV / 2);
    const segmentLength = screenHalfLength / ((Math.floor(this.rays.length / 10) * 10) / 2);

    for (let i = 0; i < this.rays.length; i++) {
      let rayAngle = this._angle + Math.atan(segmentLength * i - screenHalfLength);

      if (rayAngle < 0) {
        rayAngle += Math.PI * 2;
      }

      if (rayAngle > Math.PI * 2) {
        rayAngle -= Math.PI * 2;
      }

      this.rays[i].changeAngle(rayAngle, this._angle);
    }
  }
}
