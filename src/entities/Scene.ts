import { Hud } from 'src/view/Hud';
import { Minimap } from 'src/view/Minimap';

import { Wolf } from 'src/entities/actors/Wolf';

import type { Camera } from 'src/services/Camera';
import type { EventEmitter } from 'src/services/EventEmitter/EventEmitter';

import { INTERSECTION_TYPES, TEXTURE_SIZE, TILE_SIZE, WEAPONS, WOLF_ATTACK_FOV } from 'src/constants/config';

import { getTextureOffset } from 'src/utils/getTextureOffset';
import { clamp, getIsVertexInTheTriangle, getRangeOfView } from 'src/utils/maths';

import { GameMap } from './GameMap';

import type { Chunk, Obstacle, RawMap, ScreenData } from 'src/types';
import { isDoor, isSprite, isWall } from 'src/types/typeGuards';

export type SceneParams = {
  canvas: Scene['_canvas'];
  map: RawMap;
  screenData: Scene['_screenData'];
  emitter: Scene['_emitter'];
  fov: Camera['_fov'];
  resolutionScale: Camera['_resolutionScale'];
};

export class Scene {
  private readonly _canvas: HTMLCanvasElement;
  private readonly _ctx: CanvasRenderingContext2D;
  private readonly _gameMap: GameMap;
  private readonly _hud: Hud;
  private readonly _minimap: Minimap;
  private readonly _wolf: Wolf;
  private readonly _emitter: EventEmitter;

  private _screenData: ScreenData;

  constructor(params: SceneParams) {
    this._canvas = params.canvas;
    this._ctx = params.canvas.getContext('2d')!;

    this._screenData = params.screenData;

    this._emitter = params.emitter;

    this._gameMap = new GameMap(this._emitter, params.map);

    this._hud = new Hud({
      ctx: this._ctx,
      emitter: this._emitter,
      screenData: this._screenData,
      initialWeapon: 'PISTOL',
    });

    this._wolf = new Wolf({
      angle: 0,
      ammo: 50,
      emitter: this._emitter,
      currentWeapon: 'PISTOL',
      health: 50,
      level: 0,
      lives: 3,
      maxHealth: 100,
      position: this._gameMap.startPosition,
      score: 0,
      screenData: this._screenData,
      weapons: ['KNIFE', 'PISTOL', 'MACHINE_GUN'],
      rawValue: 'START_POS',
      resolutionScale: params.resolutionScale,
      fov: params.fov,
      parsedMap: this._gameMap.map,
    });

    this._minimap = new Minimap({
      ctx: this._ctx,
      obstacles: this._gameMap.obstacles,
      rowsLength: this._gameMap.map.length,
    });

    this.resize(this._screenData);
    this.registerEvents();
  }

  private registerEvents() {
    this._emitter.on('wolfAttack', this.handleWolfAttack.bind(this));
    this._emitter.on('wolfInteract', this.handleWolfInteract.bind(this));
    this._emitter.on('resize', this.resize.bind(this));
  }

  private resize({ width, height }: ScreenData) {
    this._canvas.width = width;
    this._canvas.height = height;

    this._screenData.height = height;
    this._screenData.width = width;
  }

  handleWolfAttack() {
    const attackRange = getRangeOfView(this._wolf.angle, WOLF_ATTACK_FOV, this._wolf.position);

    const enemiesInAttackRange = this._gameMap.enemies.filter((enemy) => {
      if (enemy.currentState === 'DIE') {
        return false;
      }

      const enemyPositionVector = enemy.getPreparedSprite(this._wolf.position, this._wolf.angle).position;
      const isLookingAt = !!this._wolf.camera.getViewAngleIntersection(enemyPositionVector);

      if (!getIsVertexInTheTriangle(enemy.position, attackRange) && !isLookingAt) {
        return false;
      }

      const castResult = enemy.castToPosition(this._wolf.position);

      if (castResult.distance > WEAPONS[this._wolf.currentWeapon].maxDistance) {
        return false;
      }

      return enemy.castToPosition(this._wolf.position).isVisible;
    });

    const closestEnemy = enemiesInAttackRange.sort((enemy, nextEnemy) => {
      const castResult = enemy.castToPosition(this._wolf.position);
      const nextCastResult = nextEnemy.castToPosition(this._wolf.position);

      return castResult.distance - nextCastResult.distance;
    })[0];

    if (closestEnemy) {
      const weapon = WEAPONS[this._wolf.currentWeapon];

      const { distance } = closestEnemy.castToPosition(this._wolf.position);
      const damageMultiplier = (weapon.maxDistance - distance) / weapon.maxDistance;
      const damage = clamp(weapon.maxDamage * damageMultiplier, weapon.minDamage, weapon.maxDamage);

      closestEnemy.hit(damage);
    }
  }

  handleWolfInteract() {
    let obstacleInViewIndex: number | null = null;
    let obstacleInView: Obstacle | null = null;

    for (let i = 0; i < this._gameMap.obstacles.length; i++) {
      const obstacle = this._gameMap.obstacles[i];

      if ((!isDoor(obstacle) && !isWall(obstacle)) || !obstacle.isMovable) {
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

    if (obstacleInViewIndex === null || !obstacleInView) {
      return;
    }

    this._gameMap.interactWithObstacle(obstacleInView);
  }

  render() {
    this._ctx.imageSmoothingEnabled = false;

    this._ctx.beginPath();
    this._ctx.clearRect(0, 0, this._screenData.width, this._screenData.height);
    this._ctx.closePath();

    // ceiling
    this._ctx.fillStyle = '#383838';
    this._ctx.fillRect(0, 0, this._screenData.width, Math.ceil(this._screenData.height / 2));

    const intersections = this._wolf.camera.getIntersections(
      this._gameMap.map,
      this._gameMap.getNonGridObstaclesInView(this._wolf)
    );
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

    this._minimap.render(this._wolf.position, this._gameMap.enemies);
  }
}
