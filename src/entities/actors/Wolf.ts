import { Actor, ActorParams } from 'src/entities/actors/abstract/Actor';

import { Camera } from 'src/services/Camera';

import { ACTOR_SPEED, DEFAULT_RESOLUTION_SCALE, TILE_SIZE, WEAPONS } from 'src/constants/config';

import type { Obstacle, ParsedMap, ScreenData, Vertex, WeaponType } from 'src/types';
import { isDoor, isItem, isWall } from 'src/types/typeGuards';

export type WolfParams = {
  ctx: Wolf['_ctx'];
  ammo: Wolf['_ammo'];
  lives: Wolf['_lives'];
  level: Wolf['_level'];
  score: Wolf['_score'];
  weapons: Wolf['_weapons'];
  onWeaponChange: Wolf['onWeaponChange'];
  onBoostPickup: Wolf['onBoostPickup'];
  onShoot: Wolf['onShoot'];
  screenData: ScreenData;
} & ActorParams;

export class Wolf extends Actor {
  protected readonly _ctx: CanvasRenderingContext2D;

  private _ammo: number;
  private _lives: number;
  private _level: number;
  private _score: number;
  private _weapons: (keyof typeof WEAPONS)[];

  private _camera: Camera;

  public readonly onWeaponChange: (newWeapon: keyof typeof WEAPONS) => void;
  public readonly onBoostPickup: () => void;
  public readonly onShoot: () => void;

  constructor(params: WolfParams) {
    super(params);

    this._ctx = params.ctx;

    this._ammo = params.ammo;
    this._score = params.score;
    this._lives = params.lives;
    this._level = params.level;
    this._weapons = params.weapons;

    this._camera = new Camera({
      raysAmount: params.screenData.width * DEFAULT_RESOLUTION_SCALE,
      position: params.position,
    });

    this.onBoostPickup = params.onBoostPickup;
    this.onWeaponChange = params.onWeaponChange;
    this.onShoot = params.onShoot;

    window.addEventListener('mousedown', this.handleMouseEvent.bind(this));
    window.addEventListener('mouseup', this.handleMouseEvent.bind(this));
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
    window.addEventListener('keyup', this.handleKeyUp.bind(this));
  }

  get angle() {
    return this.camera.angle;
  }

  get ammo() {
    return this._ammo;
  }

  get lives() {
    return this._lives;
  }

  get score() {
    return this._score;
  }

  get health() {
    return this._health;
  }

  get level() {
    return this._level;
  }

  get currentWeapon() {
    return this._currentWeapon;
  }

  get camera() {
    return this._camera;
  }

  get canShoot() {
    return this._attackTimeout.isExpired && (this._ammo > 0 || WEAPONS[this._currentWeapon].ammoPerAttack === 0);
  }

  private handleKeyDown(event: KeyboardEvent) {
    // weapons
    if (event.key === '1') {
      this.changeWeapon('KNIFE');
    } else if (event.key === '2') {
      this.changeWeapon('PISTOL');
    } else if (event.key === '3') {
      this.changeWeapon('MACHINE_GUN');
    }

    // movement
    if (event.keyCode === 87 /* w */) {
      this._verticalSpeed = ACTOR_SPEED;
    } else if (event.keyCode === 83 /* s */) {
      this._verticalSpeed = -ACTOR_SPEED;
    } else if (event.keyCode === 68 /* d */) {
      this._horizontalSpeed = ACTOR_SPEED;
    } else if (event.keyCode === 65 /* a */) {
      this._horizontalSpeed = -ACTOR_SPEED;
    }
  }

  private handleMouseEvent(event: MouseEvent) {
    // lmb down
    if (event.buttons === 1) {
      this._isShooting = true;
    }
    // lmb up
    if (event.buttons === 0) {
      this._isShooting = false;
    }
  }

  private handleKeyUp(event: KeyboardEvent) {
    if (event.keyCode === 87 /* w */ && this._verticalSpeed > 0) {
      this._verticalSpeed = 0;
    } else if (event.keyCode === 83 /* s */ && this._verticalSpeed < 0) {
      this._verticalSpeed = 0;
    } else if (event.keyCode === 68 /* d */ && this._horizontalSpeed > 0) {
      this._horizontalSpeed = 0;
    } else if (event.keyCode === 65 /* a */ && this._horizontalSpeed < 0) {
      this._horizontalSpeed = 0;
    }
  }

  private changeWeapon(weaponType: WeaponType) {
    if (this._weapons.includes(weaponType)) {
      this._currentWeapon = weaponType;

      this.onWeaponChange(this._currentWeapon);

      // weapon change timeout to prevent spamming 1-2-1-2-1-2 for fast shooting
      this._attackTimeout.set(100);
      this._attackTimeout.onTimeoutExpire = null;
    }
  }

  private shoot() {
    if (this.canShoot) {
      const weapon = WEAPONS[this._currentWeapon];

      this._attackTimeout.set(weapon.frameDuration * weapon.shootFrameIdx);

      // sync with animation
      this._attackTimeout.onTimeoutExpire = () => {
        this._ammo -= WEAPONS[this._currentWeapon].ammoPerAttack;

        // rest shoot logic

        // wait rest animation
        this._attackTimeout.set(weapon.frameDuration * (weapon.frameSet.length - weapon.shootFrameIdx));
        this._attackTimeout.onTimeoutExpire = null;
      };

      this.onShoot();
    }
  }

  private move(gameMap: ParsedMap) {
    if (this._horizontalSpeed === 0 && this._verticalSpeed === 0) {
      return;
    }

    const position: Vertex = { x: this._position.x, y: this._position.y };

    const verticalChangeX = Math.sin(this._camera.angle) * this._verticalSpeed * TIME_SCALE;
    const verticalChangeY = Math.cos(this._camera.angle) * this._verticalSpeed * TIME_SCALE;

    const horizontalChangeX = Math.sin(this._camera.angle + Math.PI / 2) * this._horizontalSpeed * TIME_SCALE;
    const horizontalChangeY = Math.cos(this._camera.angle + Math.PI / 2) * this._horizontalSpeed * TIME_SCALE;

    const xSum = verticalChangeX + horizontalChangeX;
    const ySum = verticalChangeY + horizontalChangeY;

    // avoid vector addition
    position.x += xSum >= 0 ? Math.min(xSum, ACTOR_SPEED * TIME_SCALE) : Math.max(xSum, -ACTOR_SPEED * TIME_SCALE);
    position.y += ySum >= 0 ? Math.min(ySum, ACTOR_SPEED * TIME_SCALE) : Math.max(ySum, -ACTOR_SPEED * TIME_SCALE);

    const checkCollision = (obstacle: Obstacle | null) => {
      if (!obstacle || (!obstacle.hasCollision && !isItem(obstacle))) {
        return;
      }

      let doesCollide = false;

      const matrixCoordinates =
        isWall(obstacle) && obstacle.isInFinalPosition
          ? obstacle.endPositionMatrixCoordinates
          : obstacle.matrixCoordinates;

      const preparedObstaclePosition = {
        x1: matrixCoordinates.x * TILE_SIZE,
        y1: matrixCoordinates.y * TILE_SIZE,
        x2: matrixCoordinates.x * TILE_SIZE + TILE_SIZE,
        y2: matrixCoordinates.y * TILE_SIZE + TILE_SIZE,
      };

      if (isDoor(obstacle)) {
        if (obstacle.intersectionType === 'VERTICAL') {
          preparedObstaclePosition.x1 -= TILE_SIZE / 2;
          preparedObstaclePosition.x2 += TILE_SIZE / 2;
        }
        if (obstacle.intersectionType === 'HORIZONTAL') {
          preparedObstaclePosition.y1 -= TILE_SIZE / 2;
          preparedObstaclePosition.y2 += TILE_SIZE / 2;
        }
      }

      // make obstacle hitbox bigger, to avoid player oncoming to texture TOO close
      const expandedObstacleVector = {
        x1: preparedObstaclePosition.x1 - TILE_SIZE * 0.3,
        y1: preparedObstaclePosition.y1 - TILE_SIZE * 0.3,
        x2: preparedObstaclePosition.x2 + TILE_SIZE * 0.3,
        y2: preparedObstaclePosition.y2 + TILE_SIZE * 0.3,
      };

      // if player new position is inside of hitbox
      if (
        position.x >= expandedObstacleVector.x1 &&
        position.x <= expandedObstacleVector.x2 &&
        position.y >= expandedObstacleVector.y1 &&
        position.y <= expandedObstacleVector.y2
      ) {
        // push player outside of hitbox
        if (obstacle.hasCollision) {
          if (this._position.x >= expandedObstacleVector.x1 && this._position.x <= expandedObstacleVector.x2) {
            position.y = this._position.y;
          }
          if (this._position.y >= expandedObstacleVector.y1 && this._position.y <= expandedObstacleVector.y2) {
            position.x = this._position.x;
          }
        }

        doesCollide = true;
      }

      if (doesCollide && isItem(obstacle)) {
        const { purpose } = obstacle;

        // eslint-disable-next-line default-case
        switch (purpose.affects) {
          case 'ammo': {
            if (this._ammo === 100) {
              return;
            }

            this._ammo += purpose.value;

            if (this._ammo > 100) {
              this._ammo = 100;
            }

            break;
          }
          case 'health': {
            if (this._health === this._maxHealth) {
              return;
            }

            this._health += purpose.value;

            if (this._health > this._maxHealth) {
              this._health = this._maxHealth;
            }

            break;
          }
          case 'lives': {
            this._lives += purpose.value;

            break;
          }
          case 'score': {
            this._score += purpose.value;

            break;
          }
          case 'weapons': {
            this._weapons.push(purpose.value);

            break;
          }
        }

        this.onBoostPickup();

        // remove from map when item picked up
        gameMap[obstacle.matrixCoordinates.y][obstacle.matrixCoordinates.x] = null;
      }
    };

    const positionOnMap = this.currentMatrixPosition;

    checkCollision((gameMap[positionOnMap.y - 1] || [])[positionOnMap.x - 1]);
    checkCollision((gameMap[positionOnMap.y - 1] || [])[positionOnMap.x]);
    checkCollision((gameMap[positionOnMap.y - 1] || [])[positionOnMap.x + 1]);
    checkCollision((gameMap[positionOnMap.y] || [])[positionOnMap.x - 1]);
    checkCollision((gameMap[positionOnMap.y] || [])[positionOnMap.x + 1]);
    checkCollision((gameMap[positionOnMap.y + 1] || [])[positionOnMap.x - 1]);
    checkCollision((gameMap[positionOnMap.y + 1] || [])[positionOnMap.x]);
    checkCollision((gameMap[positionOnMap.y + 1] || [])[positionOnMap.x + 1]);

    this._position = position;
    this._camera.updatePosition(this._position);
  }

  iterate(gameMap: ParsedMap) {
    this.move(gameMap);

    if (this._isShooting) {
      this.shoot();
    }

    this._attackTimeout.iterate();
  }
}
