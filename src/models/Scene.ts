import { Hud } from './view/Hud';
import { Minimap } from './view/Minimap';

import type { DoorObstacle } from './obstacles/Door';
import type { WallObstacle } from './obstacles/Wall';

import { Wolf } from './actors/Wolf/Wolf';
import type { Enemy } from './actors/abstract/Enemy';

import { Timeout } from './utility/Timeout';

import {
  DOOR_TIMEOUT,
  INTERSECTION_TYPES,
  TEXTURE_SIZE,
  TILE_SIZE,
  WEAPONS,
  WOLF_ATTACK_FOV,
} from 'src/constants/config';

import { parseMap } from 'src/utils/parseMap';

import { getTextureOffset } from 'src/helpers/getTextureOffset';
import { clamp, getIsVertexInTheTriangle, getRangeOfView, hasEqualPosition } from 'src/helpers/maths';

import type { Chunk, Obstacle, RawMap, ScreenData } from 'src/types';
import { isDoor, isEnemy, isItem, isSprite, isWall } from 'src/types/typeGuards';

export class Scene {
  private readonly _canvas: HTMLCanvasElement;
  private readonly _ctx: CanvasRenderingContext2D;
  private readonly _map: RawMap;
  private readonly _hud: Hud;
  private readonly _minimap: Minimap;
  private readonly _wolf: Wolf;
  private _parsedMap: (Obstacle | null)[][];
  private _obstacles: Obstacle[];
  private _doors: DoorObstacle[];
  private _enemies: Enemy[];
  private _currentlyMovingObstacles: (DoorObstacle | WallObstacle)[];
  private _screenData: ScreenData;

  constructor(canvas: Scene['_canvas'], map: Scene['_map'], screenData: ScreenData) {
    this._canvas = canvas;
    this._ctx = canvas.getContext('2d')!;
    this._map = map;

    this._currentlyMovingObstacles = [];

    this._screenData = screenData;

    const { obstacles, startPosition, doors, enemies, map: parsedMap } = parseMap(map);

    this._parsedMap = parsedMap;
    this._obstacles = obstacles;
    this._doors = doors;
    this._enemies = enemies;

    this._hud = new Hud({
      ctx: this._ctx,
      screenData: this._screenData,
      initialWeapon: 'PISTOL',
    });

    this._wolf = new Wolf({
      angle: 0,
      ammo: 50,
      ctx: this._ctx,
      currentWeapon: 'PISTOL',
      health: 50,
      level: 0,
      lives: 3,
      maxHealth: 100,
      position: startPosition,
      score: 0,
      screenData: this._screenData,
      weapons: ['KNIFE', 'PISTOL', 'MACHINE_GUN'],
      onBoostPickup: this._hud.onBoostPickup,
      onShoot: () => {
        this._hud.onShoot();
        this.handleWolfShoot();
      },
      onWeaponChange: this._hud.onWeaponChange,
      rawValue: 'START_POS',
    });

    this._minimap = new Minimap({
      ctx: this._ctx,
      obstacles: this._obstacles,
      rowsLength: this._map.length,
    });

    this.resize(this._screenData.width, this._screenData.height);

    window.addEventListener('keypress', this.handleKeyPress.bind(this));
  }

  set resolutionScale(scale: number) {
    this._wolf.camera.resolutionScale = scale;

    this._wolf.camera.changeRaysAmount(this._canvas.width);
  }

  set fov(newFov: number) {
    this._wolf.camera.fov = newFov;

    this._wolf.camera.changeRaysAmount(this._canvas.width);
  }

  resize(width: Scene['_canvas']['width'], height: Scene['_canvas']['height']) {
    this._canvas.width = width;
    this._canvas.height = height;

    this._screenData.height = height;
    this._screenData.width = width;

    this._wolf.camera.changeRaysAmount(this._canvas.width);
  }

  getNonGridObstacles(): Obstacle[] {
    const { position, angle } = this._wolf;
    const { fov } = this._wolf.camera;

    const rangeOfView = getRangeOfView(angle, fov, position);

    const nonGridObstacles = [...this._currentlyMovingObstacles, ...this._doors, ...this._enemies];

    // For optimization, we must reduce the number of vectors with which intersections are searched
    // push only those planes that can be visible by player side
    const obstacles = nonGridObstacles.reduce<Obstacle[]>((acc, obstacle) => {
      if (isEnemy(obstacle)) {
        acc.push(obstacle.getPreparedSprite());

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
      const isLookingAt = !!this._wolf.camera.getViewAngleIntersection(obstacle.position);

      const { x1, y1, x2, y2 } = obstacle.position;

      return (
        isLookingAt ||
        getIsVertexInTheTriangle({ x: x1, y: y1 }, rangeOfView) ||
        getIsVertexInTheTriangle({ x: x2, y: y2 }, rangeOfView)
      );
    });
  }

  moveObstacles() {
    this._currentlyMovingObstacles.forEach((obstacle) => {
      const animationEnded = obstacle.iterateMovement();

      if (isDoor(obstacle) && animationEnded) {
        if (!obstacle.isInStartPosition) {
          obstacle.closeTimeout = new Timeout(() => {
            // if player is near door, dont close door, instead reset timeout
            if (
              this._wolf.currentMatrixPosition.x >= obstacle.endPositionMatrixCoordinates.x - 1 &&
              this._wolf.currentMatrixPosition.x <= obstacle.endPositionMatrixCoordinates.x + 1 &&
              this._wolf.currentMatrixPosition.y >= obstacle.endPositionMatrixCoordinates.y - 1 &&
              this._wolf.currentMatrixPosition.y <= obstacle.endPositionMatrixCoordinates.y + 1
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
        this._parsedMap[obstacle.endPositionMatrixCoordinates.y][obstacle.endPositionMatrixCoordinates.x] = obstacle;
        this._parsedMap[obstacle.matrixCoordinates.y][obstacle.matrixCoordinates.x] = null;
      }

      // remove obstacle from moving list on animation end
      if (animationEnded) {
        this._currentlyMovingObstacles = this._currentlyMovingObstacles.filter(
          (movingObstacle) => movingObstacle !== obstacle
        );
      }
    });
  }

  handleWolfShoot() {
    const attackRange = getRangeOfView(this._wolf.angle, WOLF_ATTACK_FOV, this._wolf.position);

    const enemiesInAttackRange = this._enemies.filter((enemy) => {
      if (enemy.currentState === 'DIE') {
        return false;
      }

      const enemyPositionVector = enemy.getPreparedSprite().position;
      const isLookingAt = !!this._wolf.camera.getViewAngleIntersection(enemyPositionVector);

      if (!getIsVertexInTheTriangle(enemy.position, attackRange) && !isLookingAt) {
        return false;
      }

      const castResult = enemy.castToPosition(this._wolf.position, this._parsedMap);

      if (castResult.distance > WEAPONS[this._wolf.currentWeapon].maxDistance) {
        return false;
      }

      return enemy.castToPosition(this._wolf.position, this._parsedMap).isVisible;
    });

    const closestEnemy = enemiesInAttackRange.sort((enemy, nextEnemy) => {
      const castResult = enemy.castToPosition(this._wolf.position, this._parsedMap);
      const nextCastResult = nextEnemy.castToPosition(this._wolf.position, this._parsedMap);

      return castResult.distance - nextCastResult.distance;
    })[0];

    if (closestEnemy) {
      const weapon = WEAPONS[this._wolf.currentWeapon];

      const { distance } = closestEnemy.castToPosition(this._wolf.position, this._parsedMap);
      const damageMultiplier = (weapon.maxDistance - distance) / weapon.maxDistance;
      const damage = clamp(weapon.maxDamage * damageMultiplier, weapon.minDamage, weapon.maxDamage);

      closestEnemy.takeDamage(this._wolf.position, damage, this._parsedMap);
    }
  }

  handleKeyPress(event: KeyboardEvent) {
    if (event.keyCode === 32 /* space */) {
      let obstacleInViewIndex: number | null = null;
      let obstacleInView: Obstacle | null = null;

      for (let i = 0; i < this._obstacles.length; i++) {
        const obstacle = this._obstacles[i];

        // not interactive
        if (isSprite(obstacle) || isItem(obstacle) || !obstacle.isMovable) {
          continue;
        }

        // already activated
        if (this._currentlyMovingObstacles.includes(obstacle)) {
          continue;
        }

        const intersection = this._wolf.camera.getViewAngleIntersection(obstacle.position);

        const distance = Math.sqrt(
          (this._wolf.position.x - obstacle.position.x1) ** 2 + (this._wolf.position.y - obstacle.position.y1) ** 2
        );

        // obstacle is close to player
        if (intersection && distance <= TILE_SIZE * 2) {
          obstacleInViewIndex = i;
          obstacleInView = obstacle;
        }
      }

      if (
        obstacleInViewIndex === null ||
        !obstacleInView ||
        hasEqualPosition(obstacleInView.position, obstacleInView.endPosition)
      ) {
        return;
      }

      this._currentlyMovingObstacles.push(obstacleInView);
    }
  }

  iterate() {
    this._wolf.iterate(this._parsedMap);

    this.moveObstacles();

    this._obstacles.forEach((obstacle) => {
      if (isDoor(obstacle) && obstacle.closeTimeout) {
        obstacle.closeTimeout.iterate();
      }
    });

    this._enemies.forEach((enemy) => {
      enemy.iterate(this._wolf.position, this._wolf.angle, this._parsedMap);
    });

    this._hud.iterate();
  }

  render() {
    this._ctx.imageSmoothingEnabled = false;

    this._ctx.beginPath();
    this._ctx.clearRect(0, 0, this._screenData.width, this._screenData.height);
    this._ctx.closePath();

    // ceiling
    this._ctx.fillStyle = '#383838';
    this._ctx.fillRect(0, 0, 1920, Math.ceil(this._screenData.height / 2));

    const intersections = this._wolf.camera.getIntersections(this._parsedMap, this.getNonGridObstacles());
    // sort intersections by closest
    const sortedAndMergedIntersections = [...intersections].sort((a, b) => {
      if (b.distance === a.distance) {
        return b.distance * (b.layer * 100000) - a.distance * (a.layer * 100000);
      }

      return b.distance - a.distance;
    });

    const chunk: Chunk = {
      startTextureOffsetX: 0,
      startIndex: 0,
      width: 0,
      isInitial: true,
      rays: [],
    };

    for (let i = 0; i < sortedAndMergedIntersections.length; i++) {
      const intersection = sortedAndMergedIntersections[i];
      const { obstacle } = intersection;
      const { index } = intersection;
      const isSpriteObstacle = isSprite(obstacle);

      const nextIntersection = sortedAndMergedIntersections[i + 1];

      const textureOffsetX = getTextureOffset(intersection);
      const nextTextureOffset = nextIntersection && getTextureOffset(nextIntersection);

      if (chunk.isInitial) {
        chunk.rays.push(intersection);
        chunk.width = 1;
        chunk.startIndex = intersection.index;
        chunk.startTextureOffsetX = textureOffsetX;
        chunk.isInitial = false;
      }

      const sameLayer = nextIntersection?.layer === intersection.layer;
      const sameObstacle = nextIntersection?.obstacle === intersection.obstacle;
      const sameOrNextIndex = nextIntersection?.index === index || nextIntersection?.index === index + 1;
      const sameDistance = isSpriteObstacle || nextIntersection?.distance === intersection.distance;
      const sameTextureId = nextIntersection?.obstacle.texture === obstacle.texture;
      const sameTextureOffset = isSpriteObstacle || nextTextureOffset === textureOffsetX;

      // if true: add image to chunk and continue, if false: draw chunked images in 1 iteration
      if (
        (isSpriteObstacle && sameObstacle && sameLayer) ||
        (!isSpriteObstacle && sameOrNextIndex && sameDistance && sameTextureId && sameTextureOffset)
      ) {
        chunk.rays.push(nextIntersection);
        chunk.width += 1;
      } else {
        const isHorizontalIntersection =
          (!isWall(obstacle) && !isDoor(obstacle)) || obstacle.intersectionType === INTERSECTION_TYPES.HORIZONTAL;

        const textureHeight =
          ((TILE_SIZE / intersection.distance) * (Math.PI / this._wolf.camera.fov) * this._screenData.height) / 1.75;

        const texture =
          isHorizontalIntersection && (isWall(obstacle) || isDoor(obstacle)) ? obstacle.textureDark : obstacle.texture;

        const totalTextureOffsetX = isSpriteObstacle ? TEXTURE_SIZE - chunk.startTextureOffsetX - 1 : textureOffsetX;
        const textureOffsetY = 0;
        const textureWidth = isSpriteObstacle ? Math.abs(chunk.startTextureOffsetX - textureOffsetX) : 1;
        const textureSize = TEXTURE_SIZE;
        const textureXPositionOnScreen = chunk.startIndex / this._wolf.camera.resolutionScale;
        const textureYPositionOnScreen = this._screenData.height / 2 - textureHeight / 2;
        const textureWidthOnScreen = chunk.width / this._wolf.camera.resolutionScale;

        chunk.rays = [];
        chunk.width = 0;
        chunk.startIndex = 0;
        chunk.isInitial = true;

        this._ctx.drawImage(
          texture,
          totalTextureOffsetX,
          textureOffsetY,
          textureWidth,
          textureSize,
          textureXPositionOnScreen,
          textureYPositionOnScreen,
          textureWidthOnScreen,
          textureHeight
        );
      }
    }

    this._hud.render({
      currentWeapon: this._wolf.currentWeapon,
      ammo: this._wolf.ammo,
      lives: this._wolf.lives,
      score: this._wolf.score,
      level: this._wolf.level,
      health: this._wolf.health,
    });

    this._minimap.render(this._wolf.position, this._enemies);
  }
}
