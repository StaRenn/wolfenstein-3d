class Scene {
  private readonly camera: Camera;
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly map: GameMap;
  private readonly minimap: Minimap;
  private readonly obstacles: Obstacle[];
  private readonly doors: Obstacle[];
  private readonly sprites: HTMLImageElement[];
  private readonly textures: HTMLImageElement[];

  private parsedMap: (Obstacle | null)[][];
  private actor: Actor;
  private currentlyMovingObstacles: Obstacle[];
  private screenData: ScreenData;

  constructor(canvas: Scene['canvas'], map: Scene['map']) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.map = map;
    this.parsedMap = [];

    this.currentlyMovingObstacles = [];

    this.screenData = {
      screenHeight: this.canvas.height,
      screenWidth: this.canvas.width,
    };

    const { obstacles, startPosition, doorsObstacles } = this.parseMap(map);

    this.obstacles = obstacles;
    this.doors = doorsObstacles;

    this.minimap = new Minimap(this.ctx, this.obstacles, this.map.length, this.map[0].length);

    this.textures = [];
    this.sprites = [];

    for (let i = 1; i < 39; i++) {
      this.textures.push(getImageWithSource(`src/assets/textures/${i}.png`));
    }

    for (let i = 1; i <= 21; i++) {
      this.sprites.push(getImageWithSource(`src/assets/sprites/static/${i}.png`));
    }

    for (let i = 22; i <= 33; i++) {
      this.sprites.push(getImageWithSource(`src/assets/sprites/hollow/${i}.png`));
    }

    for (let i = 34; i <= 42; i++) {
      this.sprites.push(getImageWithSource(`src/assets/sprites/items/${i}.png`));
    }

    this.actor = new Actor(this.ctx, this.screenData, startPosition);
    this.camera = this.actor.camera;

    window.addEventListener('keypress', this.handleKeyPress.bind(this));
  }

  render() {
    this.ctx.imageSmoothingEnabled = false;

    this.ctx.beginPath();
    this.ctx.clearRect(0, 0, this.screenData.screenWidth, this.screenData.screenHeight);
    this.ctx.closePath();

    // ceiling
    this.ctx.fillStyle = '#383838';
    this.ctx.fillRect(0, 0, 1920, Math.ceil(this.screenData.screenHeight / 2));

    const nonGridPlanes = this.getNonGridPlanes();

    if (!IS_PAUSED) {
      this.moveObstacles();

      this.obstacles.forEach((obstacle) => {
        if (obstacle.closeTimeout) {
          obstacle.closeTimeout.iterate();
        }
      });
    }

    const intersections = this.camera.getIntersections(this.parsedMap, nonGridPlanes);

    const sortedAndMergedIntersections = [...intersections].sort((a, b) => b.distance - a.distance);

    const chunk: Chunk = {
      startIndex: 0,
      width: 0,
      isInitial: true,
      rays: [],
    };

    for (let i = 0; i < sortedAndMergedIntersections.length; i++) {
      const intersection = sortedAndMergedIntersections[i];
      const plane = intersection.plane;
      const index = intersection.index;

      if (chunk.isInitial) {
        chunk.rays.push(intersection);
        chunk.width = 1;
        chunk.startIndex = intersection.index;
        chunk.isInitial = false;
      }

      let textureOffsetX = this.getTextureOffset(intersection);

      const nextIntersection = sortedAndMergedIntersections[i + 1];

      const nextTextureOffset = nextIntersection && this.getTextureOffset(nextIntersection);

      const sameOrNextIndex = nextIntersection?.index === index || nextIntersection?.index === index + 1;
      const sameDistance = nextIntersection?.distance === intersection.distance;
      const sameTextureId = nextIntersection?.plane.textureId === plane.textureId;
      const sameTextureOffset = nextTextureOffset === textureOffsetX;

      if (sameOrNextIndex && sameDistance && sameTextureId && sameTextureOffset) {
        chunk.rays.push(nextIntersection);
        chunk.width += 1;
      } else {
        const isHorizontalIntersection = plane.type === INTERSECTION_TYPES.HORIZONTAL;

        textureOffsetX = this.getTextureOffset(chunk.rays[0]);

        const textureHeight =
          ((TILE_SIZE / intersection.distance) * (180 / FOV_DEGREES) * this.screenData.screenHeight) / 1.75;

        const texture = plane.isSprite
          ? this.sprites[plane.textureId - 1]
          : this.textures[plane.textureId - (isHorizontalIntersection ? 0 : 1)];

        const textureOffsetY = 0;
        const textureWidth = 1;
        const textureSize = TEXTURE_SIZE;
        const textureXPositionOnScreen = chunk.startIndex / RESOLUTION_SCALE;
        const textureYPositionOnScreen = this.screenData.screenHeight / 2 - textureHeight / 2;
        const textureWidthOnScreen = chunk.width / RESOLUTION_SCALE;

        chunk.rays = [];
        chunk.width = 0;
        chunk.startIndex = 0;
        chunk.isInitial = true;

        this.ctx.drawImage(
          texture,
          textureOffsetX,
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

    if (!IS_PAUSED) {
      this.actor.render();
      this.actor.move(this.parsedMap);
    }

    this.minimap.render(this.actor.position, this.camera.angle);
  }

  resize(width: Scene['canvas']['width'], height: Scene['canvas']['height']) {
    this.canvas.width = width;
    this.canvas.height = height;

    this.screenData.screenHeight = height;
    this.screenData.screenWidth = width;

    this.camera.changeRaysAmount(this.canvas.width);
  }

  // we calculate object width in players perspective
  // calculate length from start of the plane to the intersection |object.x - intersection.x| = n
  // then we get coefficient: n / planeLength = k
  // floor(k * TEXTURE_SIZE) = texture offset for given intersection
  getTextureOffset(intersection: IndexedIntersection) {
    const plane = intersection.plane;
    const position = plane.position;
    const isVerticalIntersection = plane.type === INTERSECTION_TYPES.VERTICAL;

    let isInverse = false;

    if (plane.isSprite) {
      if (Math.abs(position.x1 - position.x2) > Math.abs(position.y1 - position.y2)) {
        isInverse = true;
      }
    }

    const coordinatesToCompareWith = plane.shouldReverseTexture
      ? { x: position.x2, y: position.y2 }
      : { x: position.x1, y: position.y1 };

    const fromPlaneStartToIntersectionWidth =
      isVerticalIntersection || isInverse
        ? coordinatesToCompareWith.x - intersection.intersectionVertex.x
        : coordinatesToCompareWith.y - intersection.intersectionVertex.y;

    const planeLength =
      isVerticalIntersection || isInverse ? Math.abs(position.x1 - position.x2) : Math.abs(position.y1 - position.y2);

    const textureDistanceFromStartCoefficient = Math.abs(fromPlaneStartToIntersectionWidth) / planeLength;

    return Math.floor(textureDistanceFromStartCoefficient * TEXTURE_SIZE);
  }

  getAreaSize(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) {
    return Math.abs((x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)) / 2.0);
  }

  getVertexByPositionAndAngle(position: Vertex, angle: number): Vertex {
    return {
      x: position.x + RAY_LENGTH * Math.sin(angle),
      y: position.y + RAY_LENGTH * Math.cos(angle),
    };
  }

  // https://www.geeksforgeeks.org/check-whether-a-given-point-lies-inside-a-triangle-or-not/
  getIsVertexInTheTriangle({ x, y }: Vertex, { x1, y1, x2, y2, x3, y3 }: Triangle) {
    const abcArea = this.getAreaSize(x1, y1, x2, y2, x3, y3);
    const pbcArea = this.getAreaSize(x, y, x2, y2, x3, y3);
    const pacArea = this.getAreaSize(x1, y1, x, y, x3, y3);
    const pabArea = this.getAreaSize(x1, y1, x2, y2, x, y);

    return Math.round(abcArea) == Math.round(pbcArea + pacArea + pabArea);
  }

  getNonGridPlanes(): Plane[] {
    const position = this.actor.position;
    const angle = this.camera.angle;

    const leftExtremumAngle = angle - FOV;
    const rightExtremumAngle = angle + FOV;

    const currentAngleRayEndVertex = this.getVertexByPositionAndAngle(position, angle);
    const leftFOVExtremumVertex = this.getVertexByPositionAndAngle(currentAngleRayEndVertex, leftExtremumAngle);
    const rightFOVExtremumVertex = this.getVertexByPositionAndAngle(currentAngleRayEndVertex, rightExtremumAngle);

    const rangeBoundaries = {
      x1: position.x,
      y1: position.y,
      x2: leftFOVExtremumVertex.x,
      y2: leftFOVExtremumVertex.y,
      x3: rightFOVExtremumVertex.x,
      y3: rightFOVExtremumVertex.y,
    };

    const nonGridObstacles = [...this.currentlyMovingObstacles, ...this.doors];

    // For optimization, we must reduce the number of vectors with which intersections are searched
    // push only those planes that can be visible by player side
    const planes = nonGridObstacles.reduce<Plane[]>((acc, obstacle) => {
      const obstaclePos = obstacle.position;

      if (obstacle.isDoor) {
        const type = obstacle.isVertical ? OBSTACLE_SIDES.TOP : OBSTACLE_SIDES.LEFT;

        acc.push(obstacle.getWallFromObstacle(obstacle, type, null));

        return acc;
      }

      if (position.x <= obstaclePos.x1) {
        acc.push(obstacle.getWallFromObstacle(obstacle, OBSTACLE_SIDES.LEFT, null));
      }
      if (position.x >= obstaclePos.x2) {
        acc.push(obstacle.getWallFromObstacle(obstacle, OBSTACLE_SIDES.RIGHT, null));
      }
      if (position.y <= obstaclePos.y1) {
        acc.push(obstacle.getWallFromObstacle(obstacle, OBSTACLE_SIDES.TOP, null));
      }
      if (position.y >= obstaclePos.y2) {
        acc.push(obstacle.getWallFromObstacle(obstacle, OBSTACLE_SIDES.BOTTOM, null));
      }

      return acc;
    }, []);

    // get walls that are in the FOV range
    return planes.filter((plane) => {
      // If user comes straight to the plane, vertexes of the plane will not be in range of vision
      // so we need to check if user looking at the plane rn
      const isLookingAt = !!this.camera.getViewAngleIntersection(plane.position);

      const {x1, y1, x2, y2} = plane.position;

      return (
        isLookingAt ||
        this.getIsVertexInTheTriangle({x: x1, y: y1}, rangeBoundaries) ||
        this.getIsVertexInTheTriangle({x: x2, y: y2}, rangeBoundaries)
      );
    });
  }

  getPositionChange(startPosition: number, endPosition: number) {
    if (startPosition > endPosition) {
      return -OBSTACLES_MOVE_SPEED;
    } else if (startPosition < endPosition) {
      return OBSTACLES_MOVE_SPEED;
    }

    return 0;
  }

  moveObstacles() {
    this.currentlyMovingObstacles.forEach((obstacle) => {
      obstacle.isMoving = true;

      const finalPosition = obstacle.isInStartPosition ? obstacle.endPosition : obstacle.initialPosition;
      const matrixCoordinates = obstacle.matrixCoordinates;

      obstacle.position = {
        x1: obstacle.position.x1 + this.getPositionChange(obstacle.position.x1, finalPosition.x1),
        y1: obstacle.position.y1 + this.getPositionChange(obstacle.position.y1, finalPosition.y1),
        x2: obstacle.position.x2 + this.getPositionChange(obstacle.position.x2, finalPosition.x2),
        y2: obstacle.position.y2 + this.getPositionChange(obstacle.position.y2, finalPosition.y2),
      };

      if (
        obstacle.position.x1 === finalPosition.x1 &&
        obstacle.position.y1 === finalPosition.y1 &&
        obstacle.position.x2 === finalPosition.x2 &&
        obstacle.position.y2 === finalPosition.y2
      ) {
        let endPositionMatrixCoordinates = {
          y: Math.floor(finalPosition.y1 / TILE_SIZE),
          x: Math.floor(finalPosition.x1 / TILE_SIZE),
        };

        if (!obstacle.isDoor) {
          this.parsedMap[endPositionMatrixCoordinates.y][endPositionMatrixCoordinates.x] = obstacle;
          this.parsedMap[matrixCoordinates.y][matrixCoordinates.x] = null;
        }

        obstacle.isMoving = false;
        obstacle.isInStartPosition = !obstacle.isInStartPosition;
        obstacle.isInFinalPosition = !obstacle.isInFinalPosition;
        obstacle.matrixCoordinates = endPositionMatrixCoordinates;

        if (obstacle.isDoor && !obstacle.isInStartPosition) {
          obstacle.closeTimeout = new Timeout(() => {
            const actorMatrixPosition = this.actor.currentMatrixPosition;

            if (
              actorMatrixPosition.x >= matrixCoordinates.x - 1 &&
              actorMatrixPosition.x <= matrixCoordinates.x + 1 &&
              actorMatrixPosition.y >= matrixCoordinates.y - 1 &&
              actorMatrixPosition.y <= matrixCoordinates.y + 1
            ) {
              obstacle.closeTimeout!.set(DOOR_TIMEOUT);

              return;
            }

            this.currentlyMovingObstacles.push(obstacle);

            obstacle.isMoving = true;
            obstacle.closeTimeout = null;
            obstacle.hasCollision = true;
            obstacle.matrixCoordinates = matrixCoordinates;
          });

          obstacle.hasCollision = false;
          obstacle.closeTimeout.set(DOOR_TIMEOUT);
        }

        this.currentlyMovingObstacles = this.currentlyMovingObstacles.filter(
          (currentObstacle) => currentObstacle !== obstacle
        );
      }
    });
  }

  handleKeyPress(event: KeyboardEvent) {
    if (event.keyCode === 32 /* space */) {
      let obstacleInViewIndex = null;
      let obstacleInView = null;

      for (let i = 0; i < this.obstacles.length; i++) {
        const obstacle = this.obstacles[i];

        if (!obstacle.isMovable) {
          continue;
        }

        if (this.currentlyMovingObstacles.includes(obstacle)) {
          continue;
        }

        const intersection = this.camera.getViewAngleIntersection(obstacle.position);

        const distance = Math.sqrt(
          (this.actor.position.x - obstacle.position.x1) ** 2 + (this.actor.position.y - obstacle.position.y1) ** 2
        );

        if (intersection && distance <= TILE_SIZE * 2) {
          obstacleInViewIndex = i;
          obstacleInView = obstacle;
        }
      }

      if (
        !obstacleInViewIndex ||
        !obstacleInView ||
        this.camera.hasEqualPosition(obstacleInView.position, obstacleInView.endPosition)
      ) {
        return;
      }

      this.currentlyMovingObstacles.push(obstacleInView);
    }
  }

  parseMap(map: GameMap): { obstacles: Obstacle[]; startPosition: Vertex; doorsObstacles: Obstacle[] } {
    const obstacles: Obstacle[] = [];
    const doorsObstacles: Obstacle[] = [];

    let startPosition: Vertex = { x: 0, y: 0 };
    let secretObstaclesEndPositions: { [id: string]: Vector } = {};

    for (let i = 0; i < map.length; i++) {
      this.parsedMap.push([]);
      for (let j = 0; j < map[i].length; j++) {
        const value = map[i][j];

        if (value && typeof value === 'string') {
          const params = value.split('_');

          if (params[2] === 'END') {
            secretObstaclesEndPositions[params[1]] = {
              x1: j * TILE_SIZE,
              y1: i * TILE_SIZE,
              x2: j * TILE_SIZE + TILE_SIZE,
              y2: i * TILE_SIZE + TILE_SIZE,
            };
          }
        }
      }
    }

    for (let i = 0; i < map.length; i++) {
      for (let j = 0; j < map[i].length; j++) {
        let value = map[i][j];

        if (value) {
          if (value === 'START_POS') {
            startPosition = { x: j * TILE_SIZE + TILE_SIZE / 2, y: i * TILE_SIZE + TILE_SIZE / 2 };

            this.parsedMap[i].push(null);

            continue;
          }

          const obstacleParams = typeof value === 'number' ? [] : value.split('_');
          const textureId = typeof value !== 'number' ? Number(obstacleParams[0]) : value;

          if (obstacleParams && obstacleParams.includes('END')) {
            this.parsedMap[i].push(null);

            continue;
          }

          const nextToVoid = j % 63 === 0 || i % 63 === 0;

          const isItem = obstacleParams.includes('ITEM');
          const isSprite = obstacleParams.includes('SPRITE') || false;
          const isSecret = !isSprite && obstacleParams.includes('START');
          const isDoor = !isSprite && DOOR_IDS.includes(textureId);
          const isMovable = !isSprite && (isDoor || isSecret) && !nextToVoid;
          const hasCollision = !obstacleParams.includes('HOLLOW');

          let purpose = null;

          if (isItem) {
            purpose = ITEMS_PURPOSES[textureId];
          }

          const isVertical = !!(map[i][j - 1] && map[i][j + 1]);

          const position = {
            x1: j * TILE_SIZE + (!isVertical && isDoor ? TILE_SIZE * 0.5 : 0),
            y1: i * TILE_SIZE + (isVertical && isDoor ? TILE_SIZE * 0.5 : 0),
            x2: j * TILE_SIZE + (!isVertical && isDoor ? TILE_SIZE * 0.5 : TILE_SIZE),
            y2: i * TILE_SIZE + (isVertical && isDoor ? TILE_SIZE * 0.5 : TILE_SIZE),
          };

          const preparedObstacle = new Obstacle({
            matrixCoordinates: { y: Math.floor(position.y1 / TILE_SIZE), x: Math.floor(position.x1 / TILE_SIZE) },
            initialPosition: position,
            position,
            endPosition:
              isSecret && obstacleParams
                ? secretObstaclesEndPositions[obstacleParams[1]]
                : {
                    x1: isVertical ? position.x1 + TILE_SIZE : position.x1,
                    y1: !isVertical ? position.y1 - TILE_SIZE : position.y1,
                    x2: isVertical ? position.x2 + TILE_SIZE : position.x2,
                    y2: !isVertical ? position.y2 - TILE_SIZE : position.y2,
                  },
            isDoor,
            isSecret,
            isInFinalPosition: false,
            isInStartPosition: true,
            isMovable,
            isMoving: false,
            isVertical,
            isSprite,
            hasCollision,
            isItem,
            textureId,
            rawValue: value,
            closeTimeout: null,
            purpose,
          });

          if (preparedObstacle.isDoor) {
            doorsObstacles.push(preparedObstacle);
          }

          this.parsedMap[i].push(preparedObstacle);
          obstacles.push(preparedObstacle);
        } else {
          this.parsedMap[i].push(null);
        }
      }
    }

    return { obstacles, startPosition, doorsObstacles };
  }
}
