type GameMap = (0 | 1)[][];

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

type Wall = {
  position: Vector;
  type: keyof typeof INTERSECTION_TYPES;
  shouldReverseTexture: boolean;
};

class Scene {
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly map: GameMap;
  private readonly obstacles: Vector[];
  private readonly minimap: Minimap;
  private readonly camera: Camera;
  private readonly textures: HTMLImageElement;

  private screenWidth: number;
  private screenHeight: number;

  constructor(canvas: HTMLCanvasElement, map: GameMap) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.map = map;

    this.screenHeight = this.canvas.height;
    this.screenWidth = this.canvas.width;

    this.obstacles = this.generateObstaclesFromMap(map);

    const image = document.createElement('img');
    image.src = 'src/textures/textures.png';
    this.textures = image;

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

      const isVerticalIntersection = intersection.type === INTERSECTION_TYPES.VERTICAL;
      const intersectionPoint = isVerticalIntersection ? intersection.x : intersection.y;

      const height =  ((CELL_SIZE / intersection.distance) * (180 / FOV_DEGREES) * this.screenHeight) / 1.75;
      const obstacleIdx = Math.floor(intersectionPoint / CELL_SIZE);

      const shadowOffsetX = isVerticalIntersection ? TEXTURE_SIZE : 0;
      const reversedTextureOffsetX = intersection.shouldReverseTexture ? TEXTURE_SIZE : 0;
      const textureRenderPointX = (intersectionPoint - obstacleIdx * CELL_SIZE) * TEXTURE_SCALE;
      const textureOffsetX = Math.floor(Math.abs(reversedTextureOffsetX - textureRenderPointX)) + shadowOffsetX;

      if (intersection.distance !== RAY_LENGTH) {
        // texture
        this.ctx.drawImage(
          this.textures,
          textureOffsetX + 128, // texture offset x
          128, // texture offset y
          1, // texture width
          TEXTURE_SIZE, // texture height
          i, // texture x position on screen
          this.screenHeight / 2 - height / 2, // texture y position on screen
          1, // texture width on screen
          height // texture height on screen
        );
      }
      // walls
      this.ctx.fillStyle = '#5f5f61';
      this.ctx.fillRect(i, this.screenHeight / 2 - height / 2, 1, height);
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

  generateObstaclesFromMap(map: GameMap) {
    const obstacles = [];

    for (let i = 0; i < map.length; i++) {
      for (let j = 0; j < map[i].length; j++) {
        if (map[i][j]) {
          obstacles.push({
            x1: j * CELL_SIZE,
            y1: i * CELL_SIZE,
            x2: j * CELL_SIZE + CELL_SIZE,
            y2: i * CELL_SIZE + CELL_SIZE,
          });
        }
      }
    }

    return obstacles;
  }
}
