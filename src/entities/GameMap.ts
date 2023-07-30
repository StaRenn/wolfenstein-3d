import type { EventEmitter } from 'src/services/EventEmitter/EventEmitter';

import { Timeout } from 'src/controllers/Timeout';

import { AMMO_ID, DOOR_TIMEOUT, ITEMS_PURPOSES, TILE_SIZE } from 'src/constants/config';

import { getImageWithSource } from 'src/utils/getImageWithSource';
import { getIsVertexInTheTriangle, getRangeOfView } from 'src/utils/maths';
import { parseMap } from 'src/utils/parseMap';

import type { Wolf } from './actors/Wolf';
import type { Enemy } from './actors/abstract/Enemy';
import type { DoorObstacle } from './obstacles/Door';
import { ItemObstacle } from './obstacles/Item';
import type { WallObstacle } from './obstacles/Wall';

import type { Obstacle, ParsedMap, RawMap, Vertex } from 'src/types';
import { isDoor, isEnemy, isWall } from 'src/types/typeGuards';

export class GameMap {
  private readonly _emitter: EventEmitter;

  private _map: ParsedMap;
  private _enemies: Enemy[];
  private _obstacles: Obstacle[];
  private _doors: DoorObstacle[];
  private _currentlyMovingObstacles: (DoorObstacle | WallObstacle)[];
  private _wolfMatrixPosition: Vertex;

  public readonly startPosition: Vertex;

  constructor(emitter: EventEmitter, rawMap: RawMap) {
    this._emitter = emitter;

    const { obstacles, doors, enemies, map, startPosition } = parseMap(emitter, rawMap);

    this._map = map;
    this._obstacles = obstacles;
    this._doors = doors;
    this._enemies = enemies;
    this._currentlyMovingObstacles = [];
    this._wolfMatrixPosition = {
      x: Math.floor(startPosition.x / TILE_SIZE),
      y: Math.floor(startPosition.y / TILE_SIZE),
    };

    this.startPosition = startPosition;

    this.registerEvents();
  }

  get map() {
    return this._map;
  }

  get enemies() {
    return this._enemies;
  }

  get obstacles() {
    return this._obstacles;
  }

  get doors() {
    return this._doors;
  }

  private registerEvents() {
    this._emitter.on('wolfMatrixPositionChange', this.updateWolfMatrixPosition.bind(this));
    this._emitter.on('frameUpdate', this.update.bind(this));
    this._emitter.on('enemyDie', this.spawnAmmoOnDeadEnemy.bind(this));
  }

  private updateWolfMatrixPosition(position: Vertex) {
    this._wolfMatrixPosition = position;
  }

  private spawnAmmoOnDeadEnemy(enemy: Enemy) {
    this._map[enemy.currentMatrixPosition.y][enemy.currentMatrixPosition.x] = new ItemObstacle({
      position: {
        x1: enemy.currentMatrixPosition.x * TILE_SIZE,
        y1: enemy.currentMatrixPosition.y * TILE_SIZE,
        x2: enemy.currentMatrixPosition.x * TILE_SIZE + TILE_SIZE,
        y2: enemy.currentMatrixPosition.y * TILE_SIZE + TILE_SIZE,
      },
      hasCollision: false,
      texture: getImageWithSource(`src/assets/sprites/items/${AMMO_ID}.png`),
      rawValue: '34_SPRITE_HOLLOW_ITEM',
      purpose: ITEMS_PURPOSES[AMMO_ID],
    });
  }

  interactWithObstacle(obstacle: Obstacle) {
    if ((!isDoor(obstacle) && !isWall(obstacle)) || !obstacle.isMovable) {
      return;
    }

    if (!this._currentlyMovingObstacles.includes(obstacle)) {
      this._currentlyMovingObstacles.push(obstacle);
    }
  }

  getNonGridObstaclesInView(wolf: Wolf): Obstacle[] {
    const { position, angle } = wolf;
    const { fov } = wolf.camera;

    const rangeOfView = getRangeOfView(angle, fov, position);

    const nonGridObstacles = [...this._currentlyMovingObstacles, ...this._doors, ...this._enemies];

    // For optimization, we must reduce the number of vectors with which intersections are searched
    // push only those planes that can be visible by player side
    const obstacles = nonGridObstacles.reduce<Obstacle[]>((acc, obstacle) => {
      if (isEnemy(obstacle)) {
        acc.push(obstacle.getPreparedSprite(wolf.position, wolf.angle));

        return acc;
      }

      if (!isWall(obstacle)) {
        acc.push(obstacle);

        return acc;
      }

      const obstaclePos = obstacle.position;

      // get visible sides of the wall by player position
      if (position.x <= obstaclePos.x1) {
        acc.push(obstacle.wallSides.LEFT);
      }
      if (position.x >= obstaclePos.x2) {
        acc.push(obstacle.wallSides.RIGHT);
      }
      if (position.y <= obstaclePos.y1) {
        acc.push(obstacle.wallSides.TOP);
      }
      if (position.y >= obstaclePos.y2) {
        acc.push(obstacle.wallSides.BOTTOM);
      }

      return acc;
    }, []);

    // get walls that are in the FOV range
    return obstacles.filter((obstacle) => {
      // If user comes straight to the plane, vertexes of the plane will not be in range of vision
      // so we need to check if user looking at the plane rn
      const isLookingAt = !!wolf.camera.getViewAngleIntersection(obstacle.position);

      const { x1, y1, x2, y2 } = obstacle.position;

      return (
        isLookingAt ||
        getIsVertexInTheTriangle({ x: x1, y: y1 }, rangeOfView) ||
        getIsVertexInTheTriangle({ x: x2, y: y2 }, rangeOfView)
      );
    });
  }

  update() {
    this._currentlyMovingObstacles.forEach((obstacle) => {
      const animationEnded = obstacle.move();

      if (animationEnded) {
        if (isDoor(obstacle) && !obstacle.isInStartPosition) {
          obstacle.closeTimeout = new Timeout(this._emitter, () => {
            // if player is near door, dont close door, instead reset timeout
            if (
              this._wolfMatrixPosition.x >= obstacle.endPositionMatrixCoordinates.x - 1 &&
              this._wolfMatrixPosition.x <= obstacle.endPositionMatrixCoordinates.x + 1 &&
              this._wolfMatrixPosition.y >= obstacle.endPositionMatrixCoordinates.y - 1 &&
              this._wolfMatrixPosition.y <= obstacle.endPositionMatrixCoordinates.y + 1
            ) {
              obstacle.closeTimeout!.set(DOOR_TIMEOUT);

              return;
            }

            obstacle.closeTimeout = null;
            obstacle.hasCollision = true;

            this._currentlyMovingObstacles.push(obstacle);
          });

          obstacle.closeTimeout.set(DOOR_TIMEOUT);
          obstacle.hasCollision = false;
        }
      }

      // swap matrix coordinates for collision update
      if (isWall(obstacle) && animationEnded) {
        this._map[obstacle.endPositionMatrixCoordinates.y][obstacle.endPositionMatrixCoordinates.x] = obstacle;
        this._map[obstacle.matrixCoordinates.y][obstacle.matrixCoordinates.x] = null;
      }

      // remove obstacle from moving list on animation end
      if (animationEnded) {
        this._currentlyMovingObstacles = this._currentlyMovingObstacles.filter(
          (movingObstacle) => movingObstacle !== obstacle
        );
      }
    });
  }
}
