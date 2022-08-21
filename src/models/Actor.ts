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
  private canShoot: boolean;
  private isShooting: boolean;

  private weaponAnimationController: AnimationController;
  private hud: Hud;

  public position: Vertex;
  public camera: Camera;

  constructor(
    ctx: Actor['ctx'],
    obstacles: Actor['obstacles'],
    obstaclesVectorsByPurposes: Actor['obstaclesVectorsByPurposes'],
    screenData: Actor['screenData']
  ) {
    this.ammo = 50;
    this.score = 123456;
    this.ctx = ctx;
    this.currentWeapon = 'MACHINE_GUN';
    this.currentlyMovingObstacles = [];
    this.health = 100;
    this.horizontalSpeed = 0;
    this.lives = 666;
    this.level = 666;
    this.obstacles = obstacles;
    this.obstaclesVectorsByPurposes = obstaclesVectorsByPurposes;
    this.position = ACTOR_START_POSITION;
    this.screenData = screenData;
    this.verticalSpeed = 0;
    this.weapons = ['KNIFE', 'PISTOL', 'MACHINE_GUN'];
    this.canShoot = true;
    this.isShooting = false;

    this.renderWeapon = this.renderWeapon.bind(this);

    this.camera = new Camera(
      ACTOR_START_POSITION,
      this.screenData.screenWidth * RESOLUTION_SCALE,
      this.ctx,
      this.obstaclesVectorsByPurposes.walls,
      this.obstaclesVectorsByPurposes.sprites
    );

    this.hud = new Hud(this.ctx, this.screenData);

    this.weaponAnimationController = new AnimationController({
      renderFunction: this.renderWeapon,
      initialFrameIdx: 0,
      isLoopAnimation: false,
      frameSet: WEAPONS[this.currentWeapon].frameSet,
      frameSetChangeTimeout: 100,
      onAnimationEnd: () => {
        this.canShoot = true;
      },
    });

    window.addEventListener('mousedown', this.handleMouseEvent.bind(this));
    window.addEventListener('mouseup', this.handleMouseEvent.bind(this));
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
    window.addEventListener('keyup', this.handleKeyUp.bind(this));
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

  handleMouseEvent(event: MouseEvent, isShooting: boolean) {
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

  changeWeapon(weaponType: WeaponType) {
    if (this.weapons.includes(weaponType)) {
      this.currentWeapon = weaponType;
      this.weaponAnimationController.updateFrameSet(WEAPONS[this.currentWeapon].frameSet);
      this.canShoot = true;
    }
  }

  shoot() {
    if (this.ammo > 0 || this.currentWeapon === 'KNIFE') {
      this.weaponAnimationController.playAnimation();
      this.ammo -= WEAPONS[this.currentWeapon].ammoPerAttack;
      this.canShoot = false;
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

    for (let plane of this.obstaclesVectorsByPurposes.collisionObstacles) {
      const obstacle = this.obstacles[Number(plane.obstacleIdx)];

      if (
        this.position.y >= plane.position.y1 &&
        this.position.y <= plane.position.y2 &&
        ((position.x >= plane.position.x1 && this.position.x <= plane.position.x1) ||
          (position.x <= plane.position.x1 && this.position.x >= plane.position.x1))
      ) {
        position.x = this.position.x;
      }

      if (
        this.position.x >= plane.position.x1 &&
        this.position.x <= plane.position.x2 &&
        ((position.y >= plane.position.y1 && this.position.y <= plane.position.y1) ||
          (position.y <= plane.position.y1 && this.position.y >= plane.position.y1))
      ) {
        position.y = this.position.y;
      }

      if (
        position.x >= obstacle.position.x1 &&
        position.x <= obstacle.position.x2 &&
        position.y >= obstacle.position.y1 &&
        position.y <= obstacle.position.y2
      ) {
        position.y = this.position.y;
        position.x = this.position.x;
      }
    }

    this.position = position;
    this.camera.updatePosition(this.position);
  }

  render() {
    this.weaponAnimationController.iterate();

    if (this.isShooting && this.canShoot && !this.weaponAnimationController.getIsCurrentlyInTimeout()) {
      this.shoot();
    }

    this.hud.render({
      currentWeapon: this.currentWeapon,
      ammo: this.ammo,
      lives: this.lives,
      score: this.score,
      level: this.level,
      health: this.health,
    });

    this.move();
  }
}
