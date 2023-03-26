import { Frame, Obstacle, ParsedMap, PostEffectFrame, ScreenData, Vertex, WeaponType } from '../types';
import { AnimationController } from './AnimationController';
import { Hud } from './Hud';
import { Timeout } from './Timeout';
import { Camera } from './Camera';
import { isDesiredPurpose, isDoor, isItem, isMovableEntity, isWall } from '../types/typeGuards';
import { ACTOR_SPEED, HUD_WIDTH_COEFFICIENT, TEXTURE_SIZE, TILE_SIZE, WEAPONS } from '../constants/config';
import { generatePostEffectFrameSet } from '../helpers/frameSets';
import { HUD_PANEL } from '../constants/hud';

export class Actor {
  private readonly ctx: CanvasRenderingContext2D;

  private ammo: number;
  private currentWeapon: keyof typeof WEAPONS;
  private health: number;
  private horizontalSpeed: number;
  private lives: number;
  private level: number;
  private score: number;
  private screenData: ScreenData;
  private verticalSpeed: number;
  private weapons: (keyof typeof WEAPONS)[];
  private isShooting: boolean;

  private weaponAnimationController: AnimationController<Frame<HTMLImageElement>>;
  private postEffectAnimationController: AnimationController<PostEffectFrame>;
  private hud: Hud;
  private attackTimeout: Timeout;

  private _position: Vertex;
  private _camera: Camera;

  constructor(ctx: Actor['ctx'], screenData: Actor['screenData'], initialPosition: Actor['_position']) {
    this.ammo = 50;
    this.score = 0;
    this.ctx = ctx;
    this.currentWeapon = 'PISTOL';
    this.health = 20;
    this.horizontalSpeed = 0;
    this.lives = 3;
    this.level = 1;
    this._position = initialPosition;
    this.screenData = screenData;
    this.verticalSpeed = 0;
    this.weapons = ['KNIFE', 'PISTOL'];
    this.isShooting = false;

    this.renderWeapon = this.renderWeapon.bind(this);

    this._camera = new Camera(this._position, this.screenData.screenWidth * RESOLUTION_SCALE, this.ctx);

    this.hud = new Hud(this.ctx, this.screenData);

    this.attackTimeout = new Timeout();

    this.shoot = this.shoot.bind(this);
    this.renderWeapon = this.renderWeapon.bind(this);
    this.renderPostEffect = this.renderPostEffect.bind(this);

    this.weaponAnimationController = new AnimationController({
      renderFunction: this.renderWeapon,
      initialFrameIdx: 0,
      isLoopAnimation: false,
      frameSet: WEAPONS[this.currentWeapon].frameSet,
      onFrameChange: this.shoot,
    });

    this.postEffectAnimationController = new AnimationController({
      renderFunction: this.renderPostEffect,
      initialFrameIdx: 0,
      isLoopAnimation: false,
      frameSet: generatePostEffectFrameSet([255, 255, 0]),
    });

    window.addEventListener('mousedown', this.handleMouseEvent.bind(this));
    window.addEventListener('mouseup', this.handleMouseEvent.bind(this));
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
    window.addEventListener('keyup', this.handleKeyUp.bind(this));
  }

  get position() {
    return this._position;
  }

  get camera() {
    return this._camera;
  }

  get canShoot() {
    return this.attackTimeout.isExpired && (this.ammo > 0 || WEAPONS[this.currentWeapon].ammoPerAttack === 0);
  }

  get currentMatrixPosition() {
    return {
      x: Math.floor(this._position.x / TILE_SIZE),
      y: Math.floor(this._position.y / TILE_SIZE),
    };
  }

  handleKeyDown(event: KeyboardEvent) {
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
      this.verticalSpeed = ACTOR_SPEED;
    } else if (event.keyCode === 83 /* s */) {
      this.verticalSpeed = -ACTOR_SPEED;
    } else if (event.keyCode === 68 /* d */) {
      this.horizontalSpeed = ACTOR_SPEED;
    } else if (event.keyCode === 65 /* a */) {
      this.horizontalSpeed = -ACTOR_SPEED;
    }
  }

  handleMouseEvent(event: MouseEvent) {
    // lmb down
    if (event.buttons === 1) {
      this.isShooting = true;
    }
    // lmb up
    if (event.buttons === 0) {
      this.isShooting = false;
    }
  }

  handleKeyUp(event: KeyboardEvent) {
    if (event.keyCode === 87 /* w */ && this.verticalSpeed > 0) {
      this.verticalSpeed = 0;
    } else if (event.keyCode === 83 /* s */ && this.verticalSpeed < 0) {
      this.verticalSpeed = 0;
    } else if (event.keyCode === 68 /* d */ && this.horizontalSpeed > 0) {
      this.horizontalSpeed = 0;
    } else if (event.keyCode === 65 /* a */ && this.horizontalSpeed < 0) {
      this.horizontalSpeed = 0;
    }
  }

  renderWeapon(texture: HTMLImageElement) {
    const hudHeight = ((this.screenData.screenWidth * HUD_WIDTH_COEFFICIENT) / HUD_PANEL.WIDTH) * HUD_PANEL.HEIGHT;
    const weaponSize = this.screenData.screenHeight - hudHeight;
    const xOffset = this.screenData.screenWidth / 2 - weaponSize / 2;
    const yOffset = this.screenData.screenHeight - weaponSize - hudHeight;

    this.ctx.drawImage(texture, 0, 0, TEXTURE_SIZE, TEXTURE_SIZE, xOffset, yOffset, weaponSize, weaponSize);
  }

  renderPostEffect(data: PostEffectFrame['data']) {
    this.ctx.fillStyle = data.color;
    this.ctx.fillRect(0, 0, this.screenData.screenWidth, this.screenData.screenHeight);
  }

  changeWeapon(weaponType: WeaponType) {
    if (this.weapons.includes(weaponType)) {
      this.currentWeapon = weaponType;
      this.weaponAnimationController.updateFrameSet(WEAPONS[this.currentWeapon].frameSet);

      // weapon change timeout to prevent spamming 1-2-1-2-1-2 for fast shooting
      this.attackTimeout.set(100);
    }
  }

  playShootAnimation() {
    if (this.canShoot) {
      const weapon = WEAPONS[this.currentWeapon];

      this.weaponAnimationController.playAnimation();
      this.attackTimeout.set(weapon.frameDuration * weapon.frameSet.length - 1);
    }
  }

  shoot(frameIdx: number) {
    // sync shooting with animation
    if (frameIdx === WEAPONS[this.currentWeapon].shootFrameIdx) {
      this.ammo -= WEAPONS[this.currentWeapon].ammoPerAttack;

      // rest
    }
  }

  move(gameMap: ParsedMap) {
    if (this.horizontalSpeed === 0 && this.verticalSpeed === 0) {
      return;
    }

    const position: Vertex = { x: this._position.x, y: this._position.y };

    const verticalChangeX = Math.sin(this._camera.angle) * this.verticalSpeed * TIME_SCALE;
    const verticalChangeY = Math.cos(this._camera.angle) * this.verticalSpeed * TIME_SCALE;

    const horizontalChangeX = Math.sin(this._camera.angle + Math.PI / 2) * this.horizontalSpeed * TIME_SCALE;
    const horizontalChangeY = Math.cos(this._camera.angle + Math.PI / 2) * this.horizontalSpeed * TIME_SCALE;

    const xSum = verticalChangeX + horizontalChangeX;
    const ySum = verticalChangeY + horizontalChangeY;

    position.x += xSum >= 0 ? Math.min(xSum, ACTOR_SPEED * TIME_SCALE) : Math.max(xSum, -ACTOR_SPEED * TIME_SCALE);
    position.y += ySum >= 0 ? Math.min(ySum, ACTOR_SPEED * TIME_SCALE) : Math.max(ySum, -ACTOR_SPEED * TIME_SCALE);

    const checkCollision = (obstacle: Obstacle | null) => {
      if (!obstacle || (!obstacle.hasCollision && !isItem(obstacle))) {
        return;
      }

      let doesCollide = false;

      let preparedObstaclePosition = {
        ...obstacle.position,
      };

      if (isDoor(obstacle)) {
        preparedObstaclePosition = { ...obstacle.initialPosition };
      } else if (isWall(obstacle)) {
        preparedObstaclePosition = {
          ...(obstacle.isInFinalPosition ? obstacle.endPosition : obstacle.initialPosition),
        };
      }

      if (isDoor(obstacle)) {
        if (preparedObstaclePosition.x1 === preparedObstaclePosition.x2) {
          preparedObstaclePosition.x1 -= TILE_SIZE / 2;
          preparedObstaclePosition.x2 += TILE_SIZE / 2;
        }
        6;
        if (preparedObstaclePosition.y1 === preparedObstaclePosition.y2) {
          preparedObstaclePosition.y1 -= TILE_SIZE / 2;
          preparedObstaclePosition.y2 += TILE_SIZE / 2;
        }
      }

      const expandedObstacleVector = {
        x1: preparedObstaclePosition.x1 - TILE_SIZE * 0.3,
        y1: preparedObstaclePosition.y1 - TILE_SIZE * 0.3,
        x2: preparedObstaclePosition.x2 + TILE_SIZE * 0.3,
        y2: preparedObstaclePosition.y2 + TILE_SIZE * 0.3,
      };

      if (
        position.x >= expandedObstacleVector.x1 &&
        position.x <= expandedObstacleVector.x2 &&
        position.y >= expandedObstacleVector.y1 &&
        position.y <= expandedObstacleVector.y2
      ) {
        if (!isItem(obstacle)) {
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
        const purpose = obstacle.purpose;

        if (isDesiredPurpose(purpose, 'ammo')) {
          if (this.ammo === 100) {
            return;
          }

          this.ammo += purpose.value;

          if (this.ammo > 100) {
            this.ammo = 100;
          }
        }

        if (isDesiredPurpose(purpose, 'health')) {
          if (this.health === 100) {
            return;
          }

          this.health += purpose.value;

          if (this.health > 100) {
            this.health = 100;
          }
        }

        if (isDesiredPurpose(purpose, 'score')) {
          this.score += purpose.value;
        }

        if (isDesiredPurpose(purpose, 'weapons')) {
          this.weapons.push(purpose.value);
        }

        if (isDesiredPurpose(purpose, 'lives')) {
          this.lives += purpose.value;
        }

        this.postEffectAnimationController.updateFrameSet(generatePostEffectFrameSet([255, 255, 0]));
        this.postEffectAnimationController.playAnimation();

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

  render() {
    this.attackTimeout.iterate();
    this.weaponAnimationController.iterate();

    if (this.isShooting && !this.weaponAnimationController.getIsCurrentlyInTimeout()) {
      this.playShootAnimation();
    }

    this.hud.render({
      currentWeapon: this.currentWeapon,
      ammo: this.ammo,
      lives: this.lives,
      score: this.score,
      level: this.level,
      health: this.health,
    });

    this.postEffectAnimationController.iterate();
  }
}
