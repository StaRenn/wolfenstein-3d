import type { EventEmitter } from 'src/services/EventEmitter/EventEmitter';
import { MapParser } from 'src/services/MapParser';
import { NavigationMap } from 'src/services/NavigationMap/NavigationMap';

import { Timeout } from 'src/controllers/Timeout';

import { AMMO_ID, DOOR_TIMEOUT, ITEMS_PURPOSES, TILE_SIZE } from 'src/constants/config';

import { getImageWithSource } from 'src/utils/getImageWithSource';

import type { Enemy } from './actors/abstract/Enemy';
import type { EnemyAI } from './actors/abstract/EnemyAI';
import type { DoorObstacle } from './obstacles/Door';
import { ItemObstacle } from './obstacles/Item';
import type { WallObstacle } from './obstacles/Wall';

import type { Obstacle, ParsedMap, RawMap, Vertex } from 'src/types';
import { isDoor, isItem, isWall } from 'src/types/typeGuards';

export class GameMap {
  private readonly _emitter: EventEmitter;

  private _map: ParsedMap;
  private _navigationMap: NavigationMap;
  private _enemies: Enemy[];
  private _obstacles: Obstacle[];
  private _doors: DoorObstacle[];
  private _currentlyMovingObstacles: (DoorObstacle | WallObstacle)[];
  private _wolfMatrixPosition: Vertex;

  public readonly startPosition: Vertex;

  constructor(emitter: EventEmitter, rawMap: RawMap) {
    this._emitter = emitter;

    const { obstacles, doors, enemies, map, startPosition } = MapParser.parseMap(emitter, rawMap);

    this._map = map;
    this._navigationMap = new NavigationMap(this._map);
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

    this._emitter.emit('gameMapReady', this);
  }

  get map() {
    return this._map;
  }

  get navigationMap() {
    return this._navigationMap;
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

  get nonGridObstacles() {
    return [...this._currentlyMovingObstacles, ...this._doors, ...this.enemies];
  }

  private registerEvents() {
    this._emitter.on('wolfMatrixPositionChange', this.updateWolfMatrixPosition.bind(this));
    this._emitter.on('frameUpdate', this.update.bind(this));
    this._emitter.on('enemyDie', this.spawnAmmoOnDeadEnemy.bind(this));
  }

  private updateWolfMatrixPosition(position: Vertex) {
    this._wolfMatrixPosition = position;
  }

  private spawnAmmoOnDeadEnemy(enemy: EnemyAI) {
    const currentEntity = this._map[enemy.currentMatrixPosition.y][enemy.currentMatrixPosition.x];
    if (currentEntity && isItem(currentEntity) && currentEntity.purpose.affects === 'ammo') {
      currentEntity.purpose.value += ITEMS_PURPOSES[AMMO_ID].value as number;
    } else {
      this._map[enemy.currentMatrixPosition.y][enemy.currentMatrixPosition.x] = new ItemObstacle({
        position: {
          x1: enemy.currentMatrixPosition.x * TILE_SIZE,
          y1: enemy.currentMatrixPosition.y * TILE_SIZE,
          x2: enemy.currentMatrixPosition.x * TILE_SIZE + TILE_SIZE,
          y2: enemy.currentMatrixPosition.y * TILE_SIZE + TILE_SIZE,
        },
        hasCollision: false,
        texture: getImageWithSource(`src/static/assets/sprites/items/${AMMO_ID}.png`),
        rawValue: '34_SPRITE_HOLLOW_ITEM',
        purpose: ITEMS_PURPOSES[AMMO_ID],
      });
    }
  }

  interactWithObstacle(obstacle: Obstacle) {
    if ((!isDoor(obstacle) && !isWall(obstacle)) || !obstacle.isMovable) {
      return;
    }

    if (!this._currentlyMovingObstacles.includes(obstacle)) {
      this._currentlyMovingObstacles.push(obstacle);
    }
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

        this._navigationMap.updateMap(this._map);
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
