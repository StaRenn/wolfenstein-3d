type GameMap = (string | number)[][];

type Vertex = {
  x: number;
  y: number;
};

type Vector = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

type Triangle = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  x3: number;
  y3: number;
};

type Obstacle = {
  position: Vector;
  endPosition: Vector;
  textureId: number;
  isDoor: boolean;
  isSecret: boolean;
  isVertical: boolean;
  isMovable: boolean;
  isSprite: boolean;
};

type Wall = {
  position: Vector;
  type: keyof typeof INTERSECTION_TYPES;
  shouldReverseTexture: boolean;
  textureId: number;
  isMovable: boolean;
  isSprite: boolean;
  isVisible: boolean;
  obstacleIdx: number;
};

class Scene {
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly map: GameMap;
  private readonly obstacles: Obstacle[];
  private readonly minimap: Minimap;
  private readonly camera: Camera;
  private readonly textures: HTMLImageElement[];
  private readonly sprites: HTMLImageElement[];

  private screenWidth: number;
  private screenHeight: number;

  constructor(canvas: HTMLCanvasElement, map: GameMap) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.map = map;

    this.screenHeight = this.canvas.height;
    this.screenWidth = this.canvas.width;

    this.obstacles = this.generateObstaclesFromMap(map);

    this.minimap = new Minimap(this.ctx, this.obstacles);

    this.textures = [];
    this.sprites = [];

    for (let i = 1; i < 31; i++) {
      const image = new Image();
      image.src = `src/textures/${i}.png`;
      this.textures.push(image);
    }

    for (let i = 1; i < 2; i++) {
      const image = new Image();
      image.src = `src/sprites/${i}.png`;
      this.sprites.push(image);
    }

    this.camera = new Camera(CAMERA_START_POSITION, this.screenWidth, this.ctx, this.obstacles, this.map);
    //this.minimap = new Minimap(this.ctx, this.obstacles);
  }

  render() {
    this.ctx.beginPath();
    this.ctx.clearRect(0, 0, this.screenWidth, this.screenHeight);
    this.ctx.closePath();

    // ceiling
    this.ctx.fillStyle = '#5f5f61';
    this.ctx.fillRect(0, 0, 1920, Math.ceil(this.screenHeight / 2));

    this.camera.moveObstacles();
    this.camera.move();
    const intersections = this.camera.getIntersections();

    for (let i = 0; i < intersections.length; i++) {
      const intersection = intersections[i];
      const wall = intersection.wall;
      const index = intersection.index;

      const isVerticalIntersection = wall.type === INTERSECTION_TYPES.VERTICAL;

      const textureOffsetX = this.getWallTextureOffset(intersection);
      const height = ((CELL_SIZE / intersection.distance) * (180 / FOV_DEGREES) * this.screenHeight) / 1.75;

      const texture = wall.isSprite
        ? this.sprites[wall.textureId - 1]
        : this.textures[wall.textureId - (isVerticalIntersection ? 0 : 1)];

      if (intersection.distance !== RAY_LENGTH) {
        // texture
        this.ctx.drawImage(
          texture,
          textureOffsetX, // texture offset x
          0, // texture offset y
          1, // texture width
          TEXTURE_SIZE, // texture height
          index, // texture x position on screen
          this.screenHeight / 2 - height / 2, // texture y position on screen
          1, // texture width on screen
          height // texture height on screen
        );
      }
    }

    this.camera.renderIntersections(intersections);
    this.minimap.render();
  }
  // we calculate object width in players perspective
  // calculate length from start of the wall to the intersection |object.x - intersection.x| = n
  // then we get coefficient: n / wallLength = k
  // floor(k * TEXTURE_SIZE) = texture offset for given intersection
  getWallTextureOffset(intersection: Intersection) {
    const wall = intersection.wall;
    const position = wall.position;
    const isVerticalIntersection = wall.type === INTERSECTION_TYPES.VERTICAL;

    let isInverse = false;

    if (wall.isSprite) {
      if (Math.abs(position.x1 - position.x2) > Math.abs(position.y1 - position.y2)) {
        isInverse = true;
      }
    }

    const coordinatesToCompareWith = wall.shouldReverseTexture
      ? { x: position.x2, y: position.y2 }
      : { x: position.x1, y: position.y1 };

    const fromWallStartToIntersectionWidth =
      isVerticalIntersection || isInverse
        ? coordinatesToCompareWith.x - intersection.x
        : coordinatesToCompareWith.y - intersection.y;

    const wallLength =
      isVerticalIntersection || isInverse ? Math.abs(position.x1 - position.x2) : Math.abs(position.y1 - position.y2);

    const textureDistanceFromStartCoefficient = Math.abs(fromWallStartToIntersectionWidth) / wallLength;

    return Math.floor(textureDistanceFromStartCoefficient * TEXTURE_SIZE);
  }

  resize(width: number, height: number) {
    this.canvas.width = width;
    this.canvas.height = height;

    this.screenHeight = height;
    this.screenWidth = width;

    this.camera.changeRaysAmount(this.canvas.width);
  }

  generateObstaclesFromMap(map: GameMap): Obstacle[] {
    const obstacles = [];

    let secretWallsEndPositions: { [id: string]: Vector } = {};

    for (let i = 0; i < map.length; i++) {
      for (let j = 0; j < map[i].length; j++) {
        const value = map[i][j];

        if (value && typeof value === 'string') {
          const params = value.split('_');

          if (params[2] === 'END') {
            secretWallsEndPositions[params[1]] = {
              x1: j * CELL_SIZE,
              y1: i * CELL_SIZE,
              x2: j * CELL_SIZE + CELL_SIZE,
              y2: i * CELL_SIZE + CELL_SIZE,
            };
          }
        }
      }
    }

    for (let i = 0; i < map.length; i++) {
      for (let j = 0; j < map[i].length; j++) {
        const value = map[i][j];

        if (value) {
          const obstacleParams = typeof value === 'number' ? null : value.split('_');
          const valueNumber = obstacleParams ? Number(obstacleParams[0]) : (value as number);

          if (obstacleParams && obstacleParams[2] === 'END') {
            continue;
          }

          const isSecret = !!(obstacleParams && obstacleParams[2] === 'START');
          const isDoor = DOOR_IDS.includes(valueNumber);
          const isSprite = (obstacleParams && obstacleParams[1] === 'SPRITE') || false;

          const isVertical = !!(map[i][j - 1] && map[i][j + 1]);

          const position = {
            x1: j * CELL_SIZE + (!isVertical && isDoor ? CELL_SIZE * 0.5 : 0),
            y1: i * CELL_SIZE + (isVertical && isDoor ? CELL_SIZE * 0.5 : 0),
            x2: j * CELL_SIZE + (!isVertical && isDoor ? CELL_SIZE * 0.5 : CELL_SIZE),
            y2: i * CELL_SIZE + (isVertical && isDoor ? CELL_SIZE * 0.5 : CELL_SIZE),
          };

          obstacles.push({
            position,
            endPosition:
              isSecret && obstacleParams
                ? secretWallsEndPositions[obstacleParams[1]]
                : {
                    x1: isVertical ? position.x1 + CELL_SIZE : position.x1,
                    y1: !isVertical ? position.y1 - CELL_SIZE : position.y1,
                    x2: isVertical ? position.x2 + CELL_SIZE : position.x2,
                    y2: !isVertical ? position.y2 - CELL_SIZE : position.y2,
                  },
            isDoor,
            isSecret,
            isMovable: isSecret || isDoor,
            isVertical,
            isSprite,
            textureId: valueNumber,
          });
        }
      }
    }

    return obstacles;
  }
}
