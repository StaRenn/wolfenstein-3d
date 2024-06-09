import { getRelativeChunkMultiplier } from 'src/utils/getRelativeChunkMultiplier';
import { getIntersectionVertexWithPlane, getVertexByPositionAndAngle, toRadians } from 'src/utils/maths';

import type { EventEmitter } from './EventEmitter/EventEmitter';
import { Ray } from './Ray';
import { canvas } from 'src/main';

import type { IndexedIntersection, Intersection, Obstacle, ParsedMap, ScreenData, Vector, Vertex } from 'src/types';
import { isItem, isSprite, isWall } from 'src/types/typeGuards';
import { DEVICE_PIXEL_RATIO } from 'src/constants/config';

type CameraParams = {
  emitter: Camera['_emitter'];
  position: Camera['_position'];
  screenData: Camera['_screenData'];
  fov: Camera['_fov'];
  resolutionScale: Camera['_resolutionScale'];
};

export class Camera {
  private readonly _emitter: EventEmitter;

  private _rays: Ray[];
  private _position: Vertex;
  private _angle: number;
  private _resolutionScale: number;
  private _fov: number;
  private _screenData: ScreenData;

  constructor(params: CameraParams) {
    this._emitter = params.emitter;
    this._angle = toRadians(180);
    this._resolutionScale = params.resolutionScale * DEVICE_PIXEL_RATIO;
    this._fov = params.fov;

    this._screenData = params.screenData;
    this._position = params.position;
    this._rays = [];

    this.rotate = this.rotate.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handleResolutionScaleChange = this.handleResolutionScaleChange.bind(this);
    this.handleFovChange = this.handleFovChange.bind(this);
    this.handleWolfDie = this.handleWolfDie.bind(this);
    this.updatePosition = this.updatePosition.bind(this);

    this.changeRaysAmount();
    this.registerEvents();
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

  private registerEvents() {
    canvas.addEventListener('mousemove', this.rotate);

    this._emitter.on('resize', this.handleResize);
    this._emitter.on('resolutionScaleChange', this.handleResolutionScaleChange);
    this._emitter.on('fovChange', this.handleFovChange);
    this._emitter.on('wolfPositionChange', this.updatePosition);
    this._emitter.on('wolfDie', this.handleWolfDie);
  }

  private unregisterEvents() {
    canvas.removeEventListener('mousemove', this.rotate);

    this._emitter.off('resize', this.handleResize);
    this._emitter.off('resolutionScaleChange', this.handleResolutionScaleChange);
    this._emitter.off('fovChange', this.handleFovChange);
    this._emitter.off('wolfPositionChange', this.updatePosition);
    this._emitter.off('wolfDie', this.handleWolfDie);
  }

  private handleWolfDie() {
    this.unregisterEvents();
  }

  private handleResize(screenData: Camera['_screenData']) {
    this._screenData = screenData;
    this.changeRaysAmount();
  }

  private handleResolutionScaleChange(resolutionScale: number) {
    this._resolutionScale = resolutionScale;
    this.changeRaysAmount();
  }

  private handleFovChange(fov: number) {
    this._fov = fov;
  }

  private updatePosition(position: Camera['_position']) {
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
      const currentIntersections: IndexedIntersection<Obstacle>[] = [];

      let nonGridCastResult = this._rays[i].cast(nonGridPlanes, this._angle);
      const gridCastResult = this._rays[i].castDDA(parsedMap, this._angle);

      const closestNonHollowGridCast = gridCastResult.reduce<Intersection<Obstacle> | null>((acc, intersection) => {
        if (!acc && isWall(intersection.obstacle)) {
          acc = intersection;
        } else if (acc && isWall(intersection.obstacle) && intersection.distance < acc.distance) {
          acc = intersection;
        }

        return acc;
      }, null);

      if (closestNonHollowGridCast) {
        nonGridCastResult = nonGridCastResult.filter(
          (castResult) => castResult.distance < closestNonHollowGridCast.distance
        );
      }

      // calculate non grid intersections
      nonGridCastResult.forEach(({ obstacle, intersectionVertex, distance }) => {
        const relativeChunkMultiplier = isSprite(obstacle) ? 4 : getRelativeChunkMultiplier(distance);
        const preparedDistance = Math.round(distance * relativeChunkMultiplier) / relativeChunkMultiplier;

        const intersectionsAmountWithSameDistance = currentIntersections.reduce((acc, intersection) => {
          if (intersection.distance === preparedDistance) {
            acc += 1;
          }

          return acc;
        }, 0);

        currentIntersections.push({
          intersectionVertex,
          obstacle,
          distance: Math.round(distance * relativeChunkMultiplier) / relativeChunkMultiplier,
          index: i,
          layer: intersectionsAmountWithSameDistance,
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
          const intersectionsAmountWithSameDistance = currentIntersections.reduce((acc, intersection) => {
            if (intersection.distance === preparedDistance) {
              acc += 1;
            }

            return acc;
          }, 0);

          currentIntersections.push({
            obstacle: intersectedObstacle,
            distance: preparedDistance,
            index: i,
            intersectionVertex: preparedIntersection,
            layer: intersectionsAmountWithSameDistance,
          });
        }
      });

      intersections.push(...currentIntersections);
    }

    return intersections;
  }

  private changeRaysAmount() {
    this._rays = [];

    const raysAmount = this._screenData.width * this._resolutionScale;

    // you are my hero https://stackoverflow.com/a/55247059/17420897
    const screenHalfLength = Math.tan(this._fov / 2);
    const segmentLength = screenHalfLength / (raysAmount / 2);

    for (let i = 0; i < raysAmount; i++) {
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
