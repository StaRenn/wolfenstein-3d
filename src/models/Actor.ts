class Actor {
  private readonly ctx: CanvasRenderingContext2D;

  private ammo: number;
  private currentWeapon: keyof typeof WEAPONS;
  private currentlyMovingObstacles: { [index: number]: Obstacle };
  private health: number;
  private horizontalSpeed: number;
  private lives: number;
  private level: number;
  private score: number;
  private obstacles: Obstacle[];
  private obstaclesVectorsByPurposes: ObstaclesVectorsByPurposes;
  private screenData: ScreenData;
  private verticalSpeed: number;
  private weapons: (keyof typeof WEAPONS)[];
  private isShooting: boolean;

  private weaponAnimationController: AnimationController<Frame<HTMLImageElement>>;
  private postEffectAnimationController: AnimationController<PostEffectFrame>;
  private hud: Hud;
  private timeout: Timeout;

  public position: Vertex;
  public camera: Camera;

  constructor(
    ctx: Actor['ctx'],
    obstacles: Actor['obstacles'],
    obstaclesVectorsByPurposes: Actor['obstaclesVectorsByPurposes'],
    screenData: Actor['screenData'],
    initialPosition: Actor['position']
  ) {
    this.ammo = 50;
    this.score = 0;
    this.ctx = ctx;
    this.currentWeapon = 'PISTOL';
    this.currentlyMovingObstacles = [];
    this.health = 100;
    this.horizontalSpeed = 0;
    this.lives = 3;
    this.level = 1;
    this.obstacles = obstacles;
    this.obstaclesVectorsByPurposes = obstaclesVectorsByPurposes;
    this.position = initialPosition;
    this.screenData = screenData;
    this.verticalSpeed = 0;
    this.weapons = ['KNIFE', 'PISTOL'];
    this.isShooting = false;

    this.renderWeapon = this.renderWeapon.bind(this);

    this.camera = new Camera(
      this.position,
      this.screenData.screenWidth * RESOLUTION_SCALE,
      this.ctx,
      this.obstaclesVectorsByPurposes.walls,
      this.obstaclesVectorsByPurposes.sprites
    );

    this.hud = new Hud(this.ctx, this.screenData);

    this.timeout = new Timeout();

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
      frameSet: generatePostEffectFrameSet([255,255,0]),
    });

    window.addEventListener('mousedown', this.handleMouseEvent.bind(this));
    window.addEventListener('mouseup', this.handleMouseEvent.bind(this));
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
    window.addEventListener('keyup', this.handleKeyUp.bind(this));
  }

  get canShoot() {
    return this.timeout.isExpired && (this.ammo > 0 || WEAPONS[this.currentWeapon].ammoPerAttack === 0);
  }

  updateObstaclesVectorsByPurposes(obstacleVectorsByPurposes: Actor['obstaclesVectorsByPurposes']) {
    this.obstaclesVectorsByPurposes = obstacleVectorsByPurposes;

    this.camera.updateObstacles(obstacleVectorsByPurposes.walls, obstacleVectorsByPurposes.sprites);
  }

  updateObstacles(obstacles: Obstacle[]) {
    this.obstacles = obstacles;
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
    this.ctx.fillStyle = data.color
    this.ctx.fillRect(0, 0, this.screenData.screenWidth, this.screenData.screenHeight);
  }

  changeWeapon(weaponType: WeaponType) {
    if (this.weapons.includes(weaponType)) {
      this.currentWeapon = weaponType;
      this.weaponAnimationController.updateFrameSet(WEAPONS[this.currentWeapon].frameSet);

      // weapon change timeout to prevent spamming 1-2-1-2-1-2 for fast shooting
      this.timeout.set(100);
    }
  }

  playShootAnimation() {
    if (this.canShoot) {
      const weapon = WEAPONS[this.currentWeapon];

      this.weaponAnimationController.playAnimation();
      this.timeout.set(weapon.frameDuration * weapon.frameSet.length - 1);
    }
  }

  shoot(frameIdx: number) {
    // sync shooting with animation
    if (frameIdx === WEAPONS[this.currentWeapon].shootFrameIdx) {
      this.ammo -= WEAPONS[this.currentWeapon].ammoPerAttack;

      // rest
    }
  }

  move() {
    if (this.horizontalSpeed === 0 && this.verticalSpeed === 0) {
      return;
    }

    const position: Vertex = { x: this.position.x, y: this.position.y };

    const verticalChangeX = Math.sin(this.camera.angle) * this.verticalSpeed;
    const verticalChangeY = Math.cos(this.camera.angle) * this.verticalSpeed;

    const horizontalChangeX = Math.sin(this.camera.angle + Math.PI / 2) * this.horizontalSpeed;
    const horizontalChangeY = Math.cos(this.camera.angle + Math.PI / 2) * this.horizontalSpeed;

    const xSum = verticalChangeX + horizontalChangeX;
    const ySum = verticalChangeY + horizontalChangeY;

    position.x += xSum >= 0 ? Math.min(xSum, ACTOR_SPEED) : Math.max(xSum, -ACTOR_SPEED);
    position.y += ySum >= 0 ? Math.min(ySum, ACTOR_SPEED) : Math.max(ySum, -ACTOR_SPEED);

    const checkCollision = <T extends Plane>(planes: T[], shouldFixCollision: boolean) => {
      for (let plane of planes) {
        const obstacle = this.obstacles[Number(plane.obstacleIdx)];

        if (!obstacle.doesExist) {
          continue
        }

        let doesCollide = false;

        // const obstacleCenter = {
        //   x: (obstacle.position.x1 + obstacle.position.x2) / 2,
        //   y: (obstacle.position.y1 + obstacle.position.y2) / 2
        // }
        //
        // const multiplier =
        //   ((plane.position.x1 + plane.position.x2) / 2 < obstacleCenter.x ||
        //   (plane.position.y1 + plane.position.y2) / 2 < obstacleCenter.y) ? -1 : 1
        //
        // const getOffset = (firstCoordinates: keyof Vector, secondCoordinates: keyof Vector) => {
        //   return (Math.abs(plane.position[firstCoordinates] - plane.position[secondCoordinates]) > 0 ? TILE_SIZE / 2.25 * multiplier : 0)
        // }
        //
        // const getWidthOffset = (coordinate: keyof Vector) => {
        //   if(plane.type === 'VERTICAL' && coordinate !== 'x1' && coordinate !== 'x2') {
        //     console.log(plane)
        //     return 0
        //   }
        //
        //   if(plane.type === 'HORIZONTAL' && coordinate !== 'y1' && coordinate !== 'y2') {
        //     return 0
        //   }
        //
        //   return ['x1', 'y1'].includes(coordinate) ? TILE_SIZE / 2.25 * -1 : TILE_SIZE / 2.25
        // }
        //
        // const planePosition = {
        //   x1: plane.position.x1 + getOffset("y1", "y2") + getWidthOffset('x1'),
        //   y1: plane.position.y1 + getOffset("x1", "x2") + getWidthOffset('y1'),
        //   x2: plane.position.x2 - getOffset("y2", "y1") + getWidthOffset("x2"),
        //   y2: plane.position.y2 - getOffset("x2", "x1") + getWidthOffset("y2")
        // }

        if (
          this.position.y >= plane.position.y1 &&
          this.position.y <= plane.position.y2 &&
          ((position.x >= plane.position.x1 && this.position.x <= plane.position.x1) ||
            (position.x <= plane.position.x1 && this.position.x >= plane.position.x1))
        ) {
          if(shouldFixCollision) {
            position.x = this.position.x;
          }

          doesCollide = true
        }

        if (
          this.position.x >= plane.position.x1 &&
          this.position.x <= plane.position.x2 &&
          ((position.y >= plane.position.y1 && this.position.y <= plane.position.y1) ||
            (position.y <= plane.position.y1 && this.position.y >= plane.position.y1))
        ) {
          if(shouldFixCollision) {
            position.y = this.position.y;
          }

          doesCollide = true
        }

        if (
          position.x >= obstacle.position.x1 &&
          position.x <= obstacle.position.x2 &&
          position.y >= obstacle.position.y1 &&
          position.y <= obstacle.position.y2
        ) {
          if(shouldFixCollision) {
            position.y = this.position.y;
            position.x = this.position.x;
          }

          doesCollide = true
        }

        if (doesCollide && isItemObstacle(obstacle)) {
          const purpose = obstacle.purpose

          if (isDesiredPurpose(purpose, 'ammo')) {
            if (this.ammo === 100) {
              continue
            }

            this.ammo += purpose.value;

            if (this.ammo > 100) {
              this.ammo = 100
            }
          }

          if (isDesiredPurpose(purpose, 'health')) {
            if (this.health === 100) {
              continue
            }

            this.health += purpose.value;

            if (this.health > 100) {
              this.health = 100
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

          this.postEffectAnimationController.updateFrameSet(generatePostEffectFrameSet([255, 255, 0]))
          this.postEffectAnimationController.playAnimation()

          this.obstacles[Number(plane.obstacleIdx)].doesExist = false
        }
      }
    }

    checkCollision(this.obstaclesVectorsByPurposes.collisionObstacles, true)
    checkCollision(this.obstaclesVectorsByPurposes.items, false)

    this.position = position;
    this.camera.updatePosition(this.position);
  }

  render() {
    this.timeout.iterate();
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

    this.postEffectAnimationController.iterate()

    this.move();
  }
}
