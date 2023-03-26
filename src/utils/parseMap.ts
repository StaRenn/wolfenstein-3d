import { RawMap, Obstacle, Vector, Vertex } from '../types';
import { DoorObstacle } from '../models/obstacles/Door';
import { WallObstacle } from '../models/obstacles/Wall';
import { SpriteObstacle } from '../models/obstacles/Sprite';
import { ItemObstacle } from '../models/obstacles/Item';
import { DOOR_IDS, ITEMS_PURPOSES, TILE_SIZE } from '../constants/config';
import { getImageWithSource } from './getImageWithSource';

export function parseMap(
  map: RawMap
): {
  map: (Obstacle | null)[][];
  obstacles: Obstacle[];
  startPosition: Vertex;
  doors: DoorObstacle[];
} {
  const parsedMap: (Obstacle | null)[][] = [];
  const obstacles: Obstacle[] = [];
  const doors: DoorObstacle[] = [];

  let startPosition: Vertex = { x: 0, y: 0 };
  let secretObstaclesEndPositions: { [id: string]: Vector } = {};

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
      let value = map[yAxis][xAxis];

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

        const nextToVoid = xAxis % 63 === 0 || yAxis % 63 === 0;

        const isItem = obstacleParams.includes('ITEM');
        const isSprite = obstacleParams.includes('SPRITE') || false;
        const isSecret = !isSprite && obstacleParams.includes('START');
        const isDoor = !isSprite && DOOR_IDS.includes(textureId);
        const isMovable = !isSprite && (isDoor || isSecret) && !nextToVoid;
        const isWall = !isItem && !isSprite && !isDoor;
        const hasCollision = !obstacleParams.includes('HOLLOW');

        let purpose = null;

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

        if (isWall) {
          const wall = new WallObstacle({
            endPositionMatrixCoordinates: {
              y: Math.floor(endPosition.y1 / TILE_SIZE),
              x: Math.floor(endPosition.x1 / TILE_SIZE),
            },
            matrixCoordinates: { y: Math.floor(position.y1 / TILE_SIZE), x: Math.floor(position.x1 / TILE_SIZE) },
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
            matrixCoordinates: {
              y: Math.floor(position.y1 / TILE_SIZE),
              x: Math.floor(position.x1 / TILE_SIZE),
            },
            position,
            hasCollision,
            texture: getImageWithSource(`src/assets/sprites/${hasCollision ? 'static' : 'hollow'}/${textureId}.png`),
            rawValue: value,
          });

          parsedMap[yAxis].push(sprite);
          obstacles.push(sprite);
        } else if (isItem) {
          const item = new ItemObstacle({
            matrixCoordinates: { y: Math.floor(position.y1 / TILE_SIZE), x: Math.floor(position.x1 / TILE_SIZE) },
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
            endPositionMatrixCoordinates: {
              y: Math.floor(endPosition.y1 / TILE_SIZE),
              x: Math.floor(endPosition.x1 / TILE_SIZE),
            },
            matrixCoordinates: { y: Math.floor(position.y1 / TILE_SIZE), x: Math.floor(position.x1 / TILE_SIZE) },
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
  return { map: parsedMap, obstacles, startPosition, doors };
}
