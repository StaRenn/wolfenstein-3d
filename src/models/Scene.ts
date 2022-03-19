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
};

type Wall = {
  position: Vector;
  type: keyof typeof INTERSECTION_TYPES;
  shouldReverseTexture: boolean;
  textureId: number;
  isMovable: boolean;
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

  private screenWidth: number;
  private screenHeight: number;

  constructor(canvas: HTMLCanvasElement, map: GameMap) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.map = map;

    this.screenHeight = this.canvas.height;
    this.screenWidth = this.canvas.width;

    this.obstacles = this.generateObstaclesFromMap(map);

    this.textures = [];

    for (let i = 1; i < 31; i++) {
      const image = document.createElement('img');
      image.src = `src/textures/${i}.png`;
      this.textures.push(image);
    }

    this.camera = new Camera(CAMERA_START_POSITION, this.screenWidth, this.ctx, this.obstacles, this.map);
    this.minimap = new Minimap(this.ctx, this.obstacles);
  }

  render() {
    this.ctx.globalCompositeOperation = 'destination-over';
    this.ctx.beginPath();
    this.ctx.clearRect(0, 0, this.screenWidth, this.screenHeight);
    this.ctx.closePath();

    this.minimap.render();

    const intersections = this.camera.renderAndGetIntersections();

    for (let i = 0; i < intersections.length; i++) {
      const intersection = intersections[i];
      const wall = intersection.wall;

      const isVerticalIntersection = wall.type === INTERSECTION_TYPES.VERTICAL;
      const intersectionPoint = isVerticalIntersection ? intersection.x : intersection.y;

      const height = ((CELL_SIZE / intersection.distance) * (180 / FOV_DEGREES) * this.screenHeight) / 1.75;
      const obstacleIdx = Math.floor(intersectionPoint / CELL_SIZE);

      // calculating offset for moving obstacles like doors
      const movingTextureOffset = isVerticalIntersection
        ? obstacleIdx * CELL_SIZE - wall.position.x1
        : obstacleIdx * CELL_SIZE - wall.position.y1;
      const movingOffset = movingTextureOffset * TEXTURE_SCALE * (wall.shouldReverseTexture && wall.isMovable ? -1 : 1);

      const reversedTextureOffsetX = wall.shouldReverseTexture ? TEXTURE_SIZE : 0;
      const textureRenderPointX = (intersectionPoint - obstacleIdx * CELL_SIZE) * TEXTURE_SCALE;
      const textureOffsetX = Math.floor(
        Math.abs(reversedTextureOffsetX - (wall.isMovable ? textureRenderPointX % 64 : textureRenderPointX)) +
          movingOffset
      );

      if (intersection.distance !== RAY_LENGTH) {
        // texture
        this.ctx.drawImage(
          this.textures[wall.textureId - (isVerticalIntersection ? 0 : 1)],
          textureOffsetX, // texture offset x
          0, // texture offset y
          1, // texture width
          TEXTURE_SIZE, // texture height
          i, // texture x position on screen
          this.screenHeight / 2 - height / 2, // texture y position on screen
          1, // texture width on screen
          height // texture height on screen
        );
      }
      // ceiling
      this.ctx.fillStyle = '#5f5f61';
      this.ctx.fillRect(i, 0, 1, Math.ceil(this.screenHeight / 2 - height / 2));
    }
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

          const isVertical = !!(map[i][j - 1] && map[i][j + 1]);

          const position = {
            x1: j * CELL_SIZE + (!isVertical && isDoor ? CELL_SIZE * 0.5 : 0),
            y1: i * CELL_SIZE + (isVertical && isDoor ? CELL_SIZE * 0.5 : 0),
            x2: j * CELL_SIZE + (!isVertical && isDoor ? CELL_SIZE * 0.5 : CELL_SIZE),
            y2: i * CELL_SIZE + (isVertical && isDoor ? CELL_SIZE * 0.5 : CELL_SIZE),
          };

          if (isSecret) {
            console.log(position);
          }

          obstacles.push({
            position,
            endPosition: isSecret
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
            textureId: valueNumber,
          });
        }
      }
    }

    return obstacles;
  }
}
