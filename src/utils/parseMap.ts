import { Guard } from 'src/entities/actors/Guard';
import type { Enemy } from 'src/entities/actors/abstract/Enemy';
import { DoorObstacle } from 'src/entities/obstacles/Door';
import { ItemObstacle } from 'src/entities/obstacles/Item';
import { SpriteObstacle } from 'src/entities/obstacles/Sprite';
import { WallObstacle } from 'src/entities/obstacles/Wall';

import type { EventEmitter } from 'src/services/EventEmitter/EventEmitter';

import { DOOR_IDS, ENEMY_FACING_DIRECTION_MAP, ITEMS_PURPOSES, TILE_SIZE } from 'src/constants/config';

import { toRadians } from 'src/utils/maths';

import { getImageWithSource } from './getImageWithSource';

import type { EntityFrameSetByAction, Obstacle, RawMap, Vector, Vertex } from 'src/types';

export function parseMap(
  emitter: EventEmitter,
  map: RawMap
): {
  map: (Obstacle | null)[][];
  obstacles: Obstacle[];
  startPosition: Vertex;
  doors: DoorObstacle[];
  enemies: Enemy[];
} {
  const parsedMap: (Obstacle | null)[][] = [];
  const obstacles: Obstacle[] = [];
  const doors: DoorObstacle[] = [];
  const enemies: Enemy[] = [];

  let startPosition: Vertex = { x: 0, y: 0 };

  const secretObstaclesEndPositions: { [id: string]: Vector } = {};

  for (let yAxis = 0; yAxis < map.length; yAxis++) {
    parsedMap.push([]);
    for (let xAxis = 0; xAxis < map[yAxis].length; xAxis++) {
      const value = map[yAxis][xAxis];

      if (value && typeof value === 'string') {
        const params = value.split('_');

        if (params[2] === 'END') {
          secretObstaclesEndPositions[params[1]] = {
            x1: xAxis * TILE_SIZE,
            y1: yAxis * TILE_SIZE,
            x2: xAxis * TILE_SIZE + TILE_SIZE,
            y2: yAxis * TILE_SIZE + TILE_SIZE,
          };
        }
      }
    }
  }

  for (let yAxis = 0; yAxis < map.length; yAxis++) {
    for (let xAxis = 0; xAxis < map[yAxis].length; xAxis++) {
      const value = map[yAxis][xAxis];

      if (!value) {
        parsedMap[yAxis].push(null);

        continue;
      }

      if (value) {
        if (value === 'START_POS') {
          startPosition = {
            x: xAxis * TILE_SIZE + TILE_SIZE / 2,
            y: yAxis * TILE_SIZE + TILE_SIZE / 2,
          };

          parsedMap[yAxis].push(null);

          continue;
        }

        const obstacleParams = typeof value === 'number' ? [] : value.split('_');
        const textureId = typeof value !== 'number' ? Number(obstacleParams[0]) : value;

        if (obstacleParams && obstacleParams.includes('END')) {
          parsedMap[yAxis].push(null);

          continue;
        }

        const isNextToVoid = xAxis % 63 === 0 || yAxis % 63 === 0;

        const isEnemy = obstacleParams.includes('ENEMY');
        const isItem = obstacleParams.includes('ITEM');
        const isSprite = obstacleParams.includes('SPRITE') || false;
        const isSecret = !isSprite && obstacleParams.includes('START');
        const isDoor = !isSprite && DOOR_IDS.includes(textureId);
        const isMovable = !isSprite && (isDoor || isSecret) && !isNextToVoid;
        const isWall = !isEnemy && !isItem && !isSprite && !isDoor;
        const hasCollision = !obstacleParams.includes('HOLLOW');

        let purpose: typeof ITEMS_PURPOSES[keyof typeof ITEMS_PURPOSES] | null = null;

        if (isItem) {
          purpose = ITEMS_PURPOSES[textureId];
        }

        const isVertical = !!(map[yAxis][xAxis - 1] && map[yAxis][xAxis + 1]);

        const position = {
          x1: xAxis * TILE_SIZE + (!isVertical && isDoor ? TILE_SIZE * 0.5 : 0),
          y1: yAxis * TILE_SIZE + (isVertical && isDoor ? TILE_SIZE * 0.5 : 0),
          x2: xAxis * TILE_SIZE + (!isVertical && isDoor ? TILE_SIZE * 0.5 : TILE_SIZE),
          y2: yAxis * TILE_SIZE + (isVertical && isDoor ? TILE_SIZE * 0.5 : TILE_SIZE),
        };

        const endPosition =
          isSecret && obstacleParams
            ? secretObstaclesEndPositions[obstacleParams[1]]
            : {
                x1: isVertical ? position.x1 + TILE_SIZE : position.x1,
                y1: !isVertical ? position.y1 - TILE_SIZE : position.y1,
                x2: isVertical ? position.x2 + TILE_SIZE : position.x2,
                y2: !isVertical ? position.y2 - TILE_SIZE : position.y2,
              };

        if (isEnemy) {
          const enemyType = obstacleParams[1].toLowerCase();
          const enemyAction = obstacleParams[2] as keyof EntityFrameSetByAction;
          const enemyDirection = obstacleParams[3] as keyof typeof ENEMY_FACING_DIRECTION_MAP;

          if (enemyType === 'guard') {
            const enemy = new Guard({
              type: enemyType,
              parsedMap,
              emitter,
              rawValue: value,
              initialAction: enemyAction,
              angle: toRadians(ENEMY_FACING_DIRECTION_MAP[enemyDirection]),
              position: {
                x: (position.x1 + position.x2) / 2,
                y: (position.y1 + position.y2) / 2,
              },
            });

            enemies.push(enemy);
            parsedMap[yAxis].push(null);
          }
        } else if (isWall) {
          const wall = new WallObstacle({
            neighborIsDoorMap: {
              TOP: !!map[yAxis - 1]?.[xAxis] && DOOR_IDS.includes(map[yAxis - 1][xAxis] as number),
              RIGHT: !!map[yAxis]?.[xAxis + 1] && DOOR_IDS.includes(map[yAxis][xAxis + 1] as number),
              BOTTOM: !!map[yAxis + 1]?.[xAxis] && DOOR_IDS.includes(map[yAxis + 1][xAxis] as number),
              LEFT: !!map[yAxis]?.[xAxis - 1] && DOOR_IDS.includes(map[yAxis][xAxis - 1] as number),
            },
            initialPosition: position,
            position,
            endPosition,
            isInFinalPosition: false,
            isInStartPosition: true,
            isMovable,
            isMoving: false,
            hasCollision,
            texture: getImageWithSource(`src/assets/textures/${textureId}.png`),
            textureDark: getImageWithSource(`src/assets/textures/${textureId + 1}.png`),
            rawValue: value,
          });

          parsedMap[yAxis].push(wall);
          obstacles.push(wall);
        } else if (isSprite && !isItem) {
          const sprite = new SpriteObstacle({
            position,
            hasCollision,
            texture: getImageWithSource(`src/assets/sprites/${hasCollision ? 'static' : 'hollow'}/${textureId}.png`),
            rawValue: value,
          });

          parsedMap[yAxis].push(sprite);
          obstacles.push(sprite);
        } else if (isItem) {
          const item = new ItemObstacle({
            position,
            hasCollision,
            texture: getImageWithSource(`src/assets/sprites/items/${textureId}.png`),
            rawValue: value,
            purpose: purpose!,
          });

          parsedMap[yAxis].push(item);
          obstacles.push(item);
        } else if (isDoor) {
          const door = new DoorObstacle({
            initialPosition: position,
            position,
            endPosition,
            isInFinalPosition: false,
            isInStartPosition: true,
            isMovable,
            isMoving: false,
            isVertical,
            hasCollision,
            texture: getImageWithSource(`src/assets/textures/${textureId}.png`),
            textureDark: getImageWithSource(`src/assets/textures/${textureId + 1}.png`),
            rawValue: value,
            closeTimeout: null,
          });

          parsedMap[yAxis].push(door);
          obstacles.push(door);
          doors.push(door);
        }
      }
    }
  }
  return { map: parsedMap, obstacles, startPosition, doors, enemies };
}
