const WEAPONS: Weapons = {
  KNIFE: {
    maxDistance: 10,
    damage: 10,
    speed: 10,
    ammoPerAttack: 0,
    icon: '',
  },
  PISTOL: {
    maxDistance: 70,
    damage: 40,
    speed: 10,
    ammoPerAttack: 1,
    icon: '',
  },
  MACHINE_GUN: {
    maxDistance: 70,
    damage: 20,
    speed: 30,
    ammoPerAttack: 1,
    icon: '',
  },
};

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

  public position: Vertex;
  public camera: Camera;

  constructor(
    ctx: CanvasRenderingContext2D,
    obstacles: Obstacle[],
    obstaclesVectorsByPurposes: ObstaclesVectorsByPurposes,
    screenData: ScreenData
  ) {
    this.ammo = 10;
    this.ctx = ctx;
    this.currentWeapon = 'KNIFE';
    this.currentlyMovingObstacles = [];
    this.health = 100;
    this.horizontalSpeed = 0;
    this.lifes = 1;
    this.obstacles = obstacles;
    this.obstaclesVectorsByPurposes = obstaclesVectorsByPurposes;
    this.position = ACTOR_START_POSITION;
    this.screenData = screenData;
    this.verticalSpeed = 0;
    this.weapons = ['KNIFE', 'PISTOL'];

    this.camera = new Camera(
      ACTOR_START_POSITION,
      this.screenData.screenWidth * RESOLUTION_SCALE,
      this.ctx,
      this.obstaclesVectorsByPurposes.walls,
      this.obstaclesVectorsByPurposes.sprites
    );

    window.addEventListener('keydown', this.handleKeyDown.bind(this));
    window.addEventListener('keyup', this.handleKeyUp.bind(this));
  }

  updateObstaclesVectorsByPurposes(obstacleVectorsByPurposes: ObstaclesVectorsByPurposes) {
    this.obstaclesVectorsByPurposes = obstacleVectorsByPurposes;

    this.camera.updateObstacles(obstacleVectorsByPurposes.walls, obstacleVectorsByPurposes.sprites);
  }

  updateObstacles(obstacles: Obstacle[]) {
    this.obstacles = obstacles;
  }

  handleKeyDown(event: KeyboardEvent) {
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

  render() {}
}
