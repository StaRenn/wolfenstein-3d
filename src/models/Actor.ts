class Actor {
  private readonly ctx: CanvasRenderingContext2D;

  private ammo: number;
  private currentWeapon: keyof typeof WEAPONS;
  private currentlyMovingObstacles: { [index: number]: Obstacle };
  private health: number;
  private horizontalSpeed: number;
  private lifes: 1;
  private obstacles: Obstacle[];
  private obstaclesVectorsByPurposes: ObstaclesVectorsByPurposes;
  private screenData: ScreenData;
  private verticalSpeed: number;
  private weapons: (keyof typeof WEAPONS)[];
  private weaponAnimationController: AnimationController;
  private canShoot: boolean;
  private isShooting: boolean;

  public position: Vertex;
  public camera: Camera;

  constructor(
    ctx: Actor['ctx'],
    obstacles: Actor['obstacles'],
    obstaclesVectorsByPurposes: Actor['obstaclesVectorsByPurposes'],
    screenData: Actor['screenData']
  ) {
    this.ammo = 10;
    this.ctx = ctx;
    this.currentWeapon = 'MACHINE_GUN';
    this.currentlyMovingObstacles = [];
    this.health = 100;
    this.horizontalSpeed = 0;
    this.lifes = 1;
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

    this.weaponAnimationController = new AnimationController({
      ctx: this.ctx,
      renderFunction: this.renderWeapon,
      initialFrameIdx: 0,
      isLoopAnimation: false,
      frameSet: WEAPONS[this.currentWeapon].frameSet,
      frameDuration: WEAPONS[this.currentWeapon].frameDuration,
      frameSetChangeTimeout: 100,
      onAnimationEnd: () => {
        this.canShoot = true;
      },
    });

    window.addEventListener('mousedown', () => (this.isShooting = true));
    window.addEventListener('mouseup', () => (this.isShooting = false));
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
    const weaponSize = this.screenData.screenHeight;
    const xOffset = this.screenData.screenWidth / 2 - weaponSize / 2;
    const yOffset = this.screenData.screenHeight - weaponSize;

    this.ctx.drawImage(texture, 0, 0, TEXTURE_SIZE, TEXTURE_SIZE, xOffset, yOffset, weaponSize, weaponSize);
  }

  changeWeapon(weaponType: WeaponType) {
    if (this.weapons.includes(weaponType)) {
      this.currentWeapon = weaponType;
      this.weaponAnimationController.updateFrameSet(WEAPONS[this.currentWeapon].frameSet);
      this.weaponAnimationController.updateFrameDuration(WEAPONS[this.currentWeapon].frameDuration);
      this.canShoot = true;
    }
  }

  shoot() {
    this.weaponAnimationController.playAnimation();
    this.canShoot = false;
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

    this.move();
  }
}
