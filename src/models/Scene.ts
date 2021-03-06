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

type ScreenData = {
  screenHeight: number;
  screenWidth: number;
}

type ObstaclesVectorsByPurposes = {
  walls: Wall[],
  sprites: Wall[],
  collisionObstacles: Wall[]
}

class Scene {
  private readonly camera: Camera;
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly map: GameMap;
  private readonly minimap: Minimap;
  private readonly obstacles: Obstacle[];
  private readonly sprites: HTMLImageElement[];
  private readonly textures: HTMLImageElement[];

  private actor: Actor;
  private currentlyMovingObstacles: { [index: number]: Obstacle };
  private screenData: ScreenData

  constructor(canvas: HTMLCanvasElement, map: GameMap) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.map = map;

    this.currentlyMovingObstacles = []

    this.screenData = {
      screenHeight: this.canvas.height,
      screenWidth: this.canvas.width,
    }

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

    this.actor = new Actor(this.ctx, this.obstacles, {walls: [], sprites: [], collisionObstacles: []}, this.screenData)
    this.camera = this.actor.camera;

    window.addEventListener('keypress', this.handleKeyPress.bind(this));
  }

  render() {
    this.ctx.imageSmoothingEnabled = false;

    this.ctx.beginPath();
    this.ctx.clearRect(0, 0, this.screenData.screenWidth, this.screenData.screenHeight);
    this.ctx.closePath();

    // ceiling
    this.ctx.fillStyle = '#5f5f61';
    this.ctx.fillRect(0, 0, 1920, Math.ceil(this.screenData.screenHeight / 2));

    const vectorsByPurposes = this.getObstaclesVectorsByPurposes();

    if(!IS_PAUSED) {
      this.moveObstacles();
    }

    this.actor.updateObstacles(this.obstacles)
    this.actor.updateObstaclesVectorsByPurposes(vectorsByPurposes)

    if(!IS_PAUSED) {
      this.actor.move();
    }

    const intersections = this.camera.getIntersections();

    const sortedAndMergedIntersections = [...intersections.walls, ...intersections.sprites].sort((a, b) => b.distance - a.distance)

    for (let i = 0; i < sortedAndMergedIntersections.length; i++) {
      const intersection = sortedAndMergedIntersections[i];
      const wall = intersection.wall;
      const index = intersection.index;

      const isVerticalIntersection = wall.type === INTERSECTION_TYPES.VERTICAL;

      const textureOffsetX = this.getWallTextureOffset(intersection);
      const textureHeight = ((CELL_SIZE / intersection.distance) * (180 / FOV_DEGREES) * this.screenData.screenHeight) / 1.75;

      const texture = wall.isSprite
        ? this.sprites[wall.textureId - 1]
        : this.textures[wall.textureId - (isVerticalIntersection ? 0 : 1)];

      const textureOffsetY = 0;
      const textureWidth = 1
      const textureSize = TEXTURE_SIZE
      const textureXPositionOnScreen = index / RESOLUTION_SCALE
      const textureYPositionOnScreen = this.screenData.screenHeight / 2 - textureHeight / 2
      const textureWidthOnScreen = Math.max(1, 1 / RESOLUTION_SCALE)

      if (intersection.distance !== RAY_LENGTH) {
        this.ctx.drawImage(
          texture,
          textureOffsetX,
          textureOffsetY,
          textureWidth,
          textureSize,
          textureXPositionOnScreen,
          textureYPositionOnScreen,
          textureWidthOnScreen,
          textureHeight,
        );
      }
    }

    this.minimap.render(this.actor.position, intersections.walls);
  }

  resize(width: number, height: number) {
    this.canvas.width = width;
    this.canvas.height = height;

    this.screenData.screenHeight = height;
    this.screenData.screenWidth = width;

    this.camera.changeRaysAmount(this.canvas.width);
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

  getAreaSize(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) {
    return Math.abs((x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)) / 2.0);
  }

  getVertexByPositionAndAngle(position: Vertex, angle: number) {
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

  getWallVectorFromObstacle(obstacle: Obstacle, wallPosition: keyof typeof OBSTACLE_SIDES) {
    const obstaclePos = obstacle.position;
    const isDoor = obstacle.isDoor;

    return {
      x1: obstaclePos.x1 + (wallPosition === OBSTACLE_SIDES.RIGHT && !isDoor ? CELL_SIZE : 0),
      y1: obstaclePos.y1 + (wallPosition === OBSTACLE_SIDES.BOTTOM && !isDoor ? CELL_SIZE : 0),
      x2: obstaclePos.x2 - (wallPosition === OBSTACLE_SIDES.LEFT && !isDoor ? CELL_SIZE : 0),
      y2: obstaclePos.y2 - (wallPosition === OBSTACLE_SIDES.TOP && !isDoor ? CELL_SIZE : 0),
    };
  }

  getSpriteFromObstacle(obstacle: Obstacle, index: number): Wall {
    const coordinates: Vector = {
      x1: obstacle.position.x1,
      y1: obstacle.position.y1,
      x2: obstacle.position.x2,
      y2: obstacle.position.y2,
    };

    const middleVertex = {
      x: (coordinates.x2 + coordinates.x1) / 2,
      y: (coordinates.y2 + coordinates.y1) / 2,
    };

    let diff = -this.camera.angle;

    if (diff < -Math.PI) {
      diff += 2 * Math.PI;
    }
    if (diff > Math.PI) {
      diff -= 2 * Math.PI;
    }

    coordinates.x1 = middleVertex.x + (CELL_SIZE / 2) * Math.cos(diff);
    coordinates.y1 = middleVertex.y + (CELL_SIZE / 2) * Math.sin(diff);
    coordinates.x2 = middleVertex.x - (CELL_SIZE / 2) * Math.cos(diff);
    coordinates.y2 = middleVertex.y - (CELL_SIZE / 2) * Math.sin(diff);

    return {
      position: coordinates,
      type: INTERSECTION_TYPES.HORIZONTAL,
      shouldReverseTexture: true,
      textureId: obstacle.textureId,
      obstacleIdx: index,
      isMovable: false,
      isSprite: true,
      isVisible: true,
    };
  }

  getWallFromObstacle(
    obstacle: Obstacle,
    index: number,
    type: keyof typeof OBSTACLE_SIDES,
    neighbor: PreparedNeighbor | null
  ): Wall {
    const isVertical = type === OBSTACLE_SIDES.TOP || type === OBSTACLE_SIDES.BOTTOM;

    let textureId = obstacle.textureId;

    if (neighbor?.isDoor) {
      textureId = isVertical ? 29 : 30;
    }

    return {
      position: this.getWallVectorFromObstacle(obstacle, type),
      type: isVertical ? INTERSECTION_TYPES.VERTICAL : INTERSECTION_TYPES.HORIZONTAL,
      shouldReverseTexture: !neighbor?.isDoor && (type === OBSTACLE_SIDES.LEFT || type === OBSTACLE_SIDES.BOTTOM),
      textureId: textureId,
      obstacleIdx: index,
      isMovable: obstacle.isMovable,
      isVisible: !obstacle.isSprite,
      isSprite: false,
    };
  }

  getNeighbors(obstacle: Vector) {
    const neighbors: Record<keyof typeof OBSTACLE_SIDES, null | PreparedNeighbor> = {
      [OBSTACLE_SIDES.TOP]: null,
      [OBSTACLE_SIDES.LEFT]: null,
      [OBSTACLE_SIDES.BOTTOM]: null,
      [OBSTACLE_SIDES.RIGHT]: null,
    };

    Object.keys(neighbors).forEach((side: keyof typeof OBSTACLE_SIDES, i) => {
      const offset = NEIGHBOR_OFFSET[side];

      const axisY = this.map[(obstacle.y1 + (i % 2 === 0 ? offset : 0)) / CELL_SIZE];

      if (axisY) {
        const axisXValue = axisY[(obstacle.x1 + (i % 2 === 0 ? 0 : offset)) / CELL_SIZE];

        if (axisXValue) {
          const isDoor = typeof axisXValue === 'number' && DOOR_IDS.includes(axisXValue);
          const isSecret = typeof axisXValue === 'string';

          neighbors[side] = {
            isDoor,
            isSecret,
            isMovable: isDoor || isSecret,
            number: typeof axisXValue === 'number' ? axisXValue : Number(axisXValue.split('_')[0]),
          };
        }
      }
    });

    return neighbors;
  }

  getObstaclesVectorsByPurposes(): ObstaclesVectorsByPurposes {
    const position = this.actor.position
    const angle = this.camera.angle

    const leftExtremumAngle = angle - FOV;
    const rightExtremumAngle = angle + FOV;

    const currentAngleRayEndVertex = this.getVertexByPositionAndAngle(position, angle);
    const leftFOVExtremumVertex = this.getVertexByPositionAndAngle(currentAngleRayEndVertex, leftExtremumAngle);
    const rightFOVExtremumVertex = this.getVertexByPositionAndAngle(currentAngleRayEndVertex, rightExtremumAngle);

    const lengthBoundaries = {
      x1: position.x - RAY_LENGTH,
      y1: position.y - RAY_LENGTH,
      x2: position.x + RAY_LENGTH,
      y2: position.y + RAY_LENGTH,
    };

    const rangeBoundaries = {
      x1: position.x,
      y1: position.y,
      x2: leftFOVExtremumVertex.x,
      y2: leftFOVExtremumVertex.y,
      x3: rightFOVExtremumVertex.x,
      y3: rightFOVExtremumVertex.y,
    };

    const sprites: Wall[] = [];

    // For optimization, we must reduce the number of vectors with which intersections are searched
    // push only those walls that can be visible by player side
    const walls = this.obstacles.reduce<Wall[]>((acc, obstacle, i) => {
      const obstaclePos = obstacle.position;
      const obstacleNeighbors = this.getNeighbors(obstaclePos);

      if (obstacle.isSprite) {
        sprites.push(this.getSpriteFromObstacle(obstacle, i));
      }

      if (obstacle.isDoor) {
        const type = obstacle.isVertical ? OBSTACLE_SIDES.TOP : OBSTACLE_SIDES.LEFT;

        acc.push(this.getWallFromObstacle(obstacle, i, type, null));

        return acc;
      }

      if (position.x <= obstaclePos.x1 && (!obstacleNeighbors.LEFT || obstacleNeighbors.LEFT.isMovable)) {
        acc.push(this.getWallFromObstacle(obstacle, i, OBSTACLE_SIDES.LEFT, obstacleNeighbors.LEFT));
      }
      if (position.x >= obstaclePos.x2 && (!obstacleNeighbors.RIGHT || obstacleNeighbors.RIGHT.isMovable)) {
        acc.push(this.getWallFromObstacle(obstacle, i, OBSTACLE_SIDES.RIGHT, obstacleNeighbors.RIGHT));
      }
      if (position.y <= obstaclePos.y1 && (!obstacleNeighbors.TOP || obstacleNeighbors.TOP.isMovable)) {
        acc.push(this.getWallFromObstacle(obstacle, i, OBSTACLE_SIDES.TOP, obstacleNeighbors.TOP));
      }
      if (position.y >= obstaclePos.y2 && (!obstacleNeighbors.BOTTOM || obstacleNeighbors.BOTTOM.isMovable)) {
        acc.push(this.getWallFromObstacle(obstacle, i, OBSTACLE_SIDES.BOTTOM, obstacleNeighbors.BOTTOM));
      }

      return acc;
    }, []);

    // get walls that are in the ray length range
    const wallsByLength = walls.filter(
      (wall) =>
        wall.position.y1 >= lengthBoundaries.y1 &&
        wall.position.x1 >= lengthBoundaries.x1 &&
        wall.position.x2 <= lengthBoundaries.x2 &&
        wall.position.y2 <= lengthBoundaries.y2
    );

    // get walls that are in the FOV range
    const wallsByRange = wallsByLength.filter((wall) => {
      // If user comes straight to the wall, vertexes of the wall will not be in range of vision
      // so we need to check if user looking at the wall rn
      const isLookingAt = !!this.camera.getViewAngleIntersection(wall.position);

      const { x1, y1, x2, y2 } = wall.position;

      return (
        isLookingAt ||
        this.getIsVertexInTheTriangle({ x: x1, y: y1 }, rangeBoundaries) ||
        this.getIsVertexInTheTriangle({ x: x2, y: y2 }, rangeBoundaries)
      );
    });

    // we are trying to find here if wall is behind another one
    // so we dont need to find intersections with wall that we cant see
    // get lines from camera to both edges of the wall and find if every line intersects with any another wall
    // unfortunately this is O(N^2) but it works good if we have less amount of walls in range than window width (almost impossible)

    // if 2 vectors are blocked but by different walls that wall will count as visible
    // i tried to fix that, but then i found that 2 vertexes of the wall can be blocked
    // but some part of the wall can still be visible, and checking for that would cost a lot of resources
    // so better to leave it as it is
    const wallsByCameraVertexIntersections = wallsByRange.filter((wallByRange) => {
      // these type of walls used for render, so we dont want invisible walls to be raycasted
      if (!wallByRange.isVisible) {
        return false;
      }

      return !wallsByRange.some((wall) => {
        return [
          { x1: wallByRange.position.x1, y1: wallByRange.position.y1, x2: position.x, y2: position.y },
          { x1: wallByRange.position.x2, y1: wallByRange.position.y2, x2: position.x, y2: position.y },
        ].every((vector) => {
          if (wall === wallByRange || !wall.isVisible) {
            return false;
          }

          return !!Ray.getIntersectionVertexWithWall(vector, wall.position);
        });
      });
    });

    return {
      walls: wallsByCameraVertexIntersections,
      collisionObstacles: wallsByLength,
      sprites,
    };
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
    Object.keys(this.currentlyMovingObstacles).forEach((key) => {
      const obstacle = this.obstacles[Number(key)];

      this.obstacles[Number(key)].position = {
        x1: obstacle.position.x1 + this.getPositionChange(obstacle.position.x1, obstacle.endPosition.x1),
        y1: obstacle.position.y1 + this.getPositionChange(obstacle.position.y1, obstacle.endPosition.y1),
        x2: obstacle.position.x2 + this.getPositionChange(obstacle.position.x2, obstacle.endPosition.x2),
        y2: obstacle.position.y2 + this.getPositionChange(obstacle.position.y2, obstacle.endPosition.y2),
      };

      if (
        obstacle.position.x1 === obstacle.endPosition.x1 &&
        obstacle.position.y1 === obstacle.endPosition.y1 &&
        obstacle.position.x2 === obstacle.endPosition.x2 &&
        obstacle.position.y2 === obstacle.endPosition.y2
      ) {
        delete this.currentlyMovingObstacles[Number(key)];
      }
    });
  }

  handleKeyPress(event: KeyboardEvent) {
    if (event.keyCode === 32 /* space */) {
      let obstacleInViewIndex = null;
      let obstacleInView = null;

      for (let i = 0; i < this.obstacles.length; i++) {
        const obstacle = this.obstacles[i];

        if (!obstacle.isDoor && !obstacle.isSecret) {
          continue;
        }

        const intersection = this.camera.getViewAngleIntersection(obstacle.position);

        const distance = Math.sqrt(
          (this.actor.position.x - obstacle.position.x1) ** 2 + (this.actor.position.y - obstacle.position.y1) ** 2
        );

        if (intersection && distance <= CELL_SIZE * 2) {
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

      this.currentlyMovingObstacles[obstacleInViewIndex] = obstacleInView;
    }
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
