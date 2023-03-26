import { Camera } from './Camera';
import { Chunk, RawMap, Obstacle, ScreenData } from '../types';
import { Minimap } from './Minimap';
import { DoorObstacle } from './obstacles/Door';
import { Actor } from './Actor';
import { WallObstacle } from './obstacles/Wall';
import { parseMap } from '../utils/parseMap';
import { isDoor, isItem, isSprite, isWall } from '../types/typeGuards';
import { DOOR_TIMEOUT, INTERSECTION_TYPES, OBSTACLE_SIDES, TEXTURE_SIZE, TILE_SIZE } from '../constants/config';
import { Timeout } from './Timeout';
import { getIsVertexInTheTriangle, getVertexByPositionAndAngle, hasEqualPosition } from '../helpers/maths';
import { getTextureOffset } from '../helpers/getTextureOffset';

export class Scene {
  private readonly camera: Camera;
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly map: RawMap;
  private readonly minimap: Minimap;

  private parsedMap: (Obstacle | null)[][];
  private obstacles: Obstacle[];
  private doors: DoorObstacle[];
  private actor: Actor;
  private currentlyMovingObstacles: (DoorObstacle | WallObstacle)[];
  private screenData: ScreenData;

  constructor(canvas: Scene['canvas'], map: Scene['map']) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.map = map;

    this.currentlyMovingObstacles = [];

    this.screenData = {
      screenHeight: this.canvas.height,
      screenWidth: this.canvas.width,
    };

    const { obstacles, startPosition, doors, map: parsedMap } = parseMap(map);

    this.parsedMap = parsedMap;
    this.obstacles = obstacles;
    this.doors = doors;

    this.minimap = new Minimap(this.ctx, this.obstacles, this.map.length, this.map[0].length);

    this.actor = new Actor(this.ctx, this.screenData, startPosition);
    this.camera = this.actor.camera;

    window.addEventListener('keypress', this.handleKeyPress.bind(this));
  }

  resize(width: Scene['canvas']['width'], height: Scene['canvas']['height']) {
    this.canvas.width = width;
    this.canvas.height = height;

    this.screenData.screenHeight = height;
    this.screenData.screenWidth = width;

    this.camera.changeRaysAmount(this.canvas.width);
  }

  getNonGridObstacles(): Obstacle[] {
    const position = this.actor.position;
    const angle = this.camera.angle;

    const leftExtremumAngle = angle - FOV;
    const rightExtremumAngle = angle + FOV;

    const currentAngleRayEndVertex = getVertexByPositionAndAngle(position, angle);
    const leftFOVExtremumVertex = getVertexByPositionAndAngle(currentAngleRayEndVertex, leftExtremumAngle);
    const rightFOVExtremumVertex = getVertexByPositionAndAngle(currentAngleRayEndVertex, rightExtremumAngle);

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
    const planes = nonGridObstacles.reduce<Obstacle[]>((acc, obstacle) => {
      const obstaclePos = obstacle.position;

      if (!isWall(obstacle)) {
        acc.push(obstacle);

        return acc;
      }

      if (position.x <= obstaclePos.x1) {
        acc.push(obstacle.getWallBySide(OBSTACLE_SIDES.LEFT, null));
      }
      if (position.x >= obstaclePos.x2) {
        acc.push(obstacle.getWallBySide(OBSTACLE_SIDES.RIGHT, null));
      }
      if (position.y <= obstaclePos.y1) {
        acc.push(obstacle.getWallBySide(OBSTACLE_SIDES.TOP, null));
      }
      if (position.y >= obstaclePos.y2) {
        acc.push(obstacle.getWallBySide(OBSTACLE_SIDES.BOTTOM, null));
      }

      return acc;
    }, []);

    // get walls that are in the FOV range
    return planes.filter((plane) => {
      // If user comes straight to the plane, vertexes of the plane will not be in range of vision
      // so we need to check if user looking at the plane rn
      const isLookingAt = !!this.camera.getViewAngleIntersection(plane.position);

      const { x1, y1, x2, y2 } = plane.position;

      return (
        isLookingAt ||
        getIsVertexInTheTriangle({ x: x1, y: y1 }, rangeBoundaries) ||
        getIsVertexInTheTriangle({ x: x2, y: y2 }, rangeBoundaries)
      );
    });
  }

  moveObstacles() {
    this.currentlyMovingObstacles.forEach((obstacle) => {
      const animationEnded = obstacle.iterateMovement();

      if (isDoor(obstacle) && animationEnded) {
        if (!obstacle.isInStartPosition) {
          obstacle.closeTimeout = new Timeout(() => {
            // if player is near door, dont close door, instead reset timeout
            if (
              this.actor.currentMatrixPosition.x >= obstacle.endPositionMatrixCoordinates.x - 1 &&
              this.actor.currentMatrixPosition.x <= obstacle.endPositionMatrixCoordinates.x + 1 &&
              this.actor.currentMatrixPosition.y >= obstacle.endPositionMatrixCoordinates.y - 1 &&
              this.actor.currentMatrixPosition.y <= obstacle.endPositionMatrixCoordinates.y + 1
            ) {
              obstacle.closeTimeout!.set(DOOR_TIMEOUT);

              return;
            }

            obstacle.closeTimeout = null;
            obstacle.hasCollision = true;

            this.currentlyMovingObstacles.push(obstacle);
          });

          obstacle.closeTimeout.set(DOOR_TIMEOUT);
          obstacle.hasCollision = false;
        }
      }

      if (isWall(obstacle) && animationEnded) {
        this.parsedMap[obstacle.endPositionMatrixCoordinates.y][obstacle.endPositionMatrixCoordinates.x] = obstacle;
        this.parsedMap[obstacle.matrixCoordinates.y][obstacle.matrixCoordinates.x] = null;
      }

      if (animationEnded) {
        this.currentlyMovingObstacles = this.currentlyMovingObstacles.filter(
          (movingObstacle) => movingObstacle !== obstacle
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

        if (isSprite(obstacle) || isItem(obstacle) || !obstacle.isMovable) {
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
        obstacleInViewIndex === null ||
        !obstacleInView ||
        hasEqualPosition(obstacleInView.position, obstacleInView.endPosition)
      ) {
        return;
      }

      this.currentlyMovingObstacles.push(obstacleInView);
    }
  }

  render() {
    this.ctx.imageSmoothingEnabled = false;

    this.ctx.beginPath();
    this.ctx.clearRect(0, 0, this.screenData.screenWidth, this.screenData.screenHeight);
    this.ctx.closePath();

    // ceiling
    this.ctx.fillStyle = '#383838';
    this.ctx.fillRect(0, 0, 1920, Math.ceil(this.screenData.screenHeight / 2));

    if (!IS_PAUSED) {
      this.moveObstacles();

      this.obstacles.forEach((obstacle) => {
        if (isDoor(obstacle) && obstacle.closeTimeout) {
          obstacle.closeTimeout.iterate();
        }
      });
    }

    const intersections = this.camera.getIntersections(this.parsedMap, this.getNonGridObstacles());
    const sortedAndMergedIntersections = [...intersections].sort((a, b) => b.distance - a.distance);

    const chunk: Chunk = {
      startIndex: 0,
      width: 0,
      isInitial: true,
      rays: [],
    };

    for (let i = 0; i < sortedAndMergedIntersections.length; i++) {
      const intersection = sortedAndMergedIntersections[i];
      const obstacle = intersection.obstacle;
      const index = intersection.index;

      if (chunk.isInitial) {
        chunk.rays.push(intersection);
        chunk.width = 1;
        chunk.startIndex = intersection.index;
        chunk.isInitial = false;
      }

      let textureOffsetX = getTextureOffset(intersection);

      const nextIntersection = sortedAndMergedIntersections[i + 1];

      const nextTextureOffset = nextIntersection && getTextureOffset(nextIntersection);

      const sameOrNextIndex = nextIntersection?.index === index || nextIntersection?.index === index + 1;
      const sameDistance = nextIntersection?.distance === intersection.distance;
      const sameTextureId = nextIntersection?.obstacle.texture === obstacle.texture;
      const sameTextureOffset = nextTextureOffset === textureOffsetX;

      if (sameOrNextIndex && sameDistance && sameTextureId && sameTextureOffset) {
        chunk.rays.push(nextIntersection);
        chunk.width += 1;
      } else {
        const isHorizontalIntersection =
          (!isWall(obstacle) && !isDoor(obstacle)) || obstacle.intersectionType === INTERSECTION_TYPES.HORIZONTAL;

        textureOffsetX = getTextureOffset(chunk.rays[0]);

        const textureHeight =
          ((TILE_SIZE / intersection.distance) * (180 / FOV_DEGREES) * this.screenData.screenHeight) / 1.75;

        const texture =
          isHorizontalIntersection && (isWall(obstacle) || isDoor(obstacle)) ? obstacle.textureDark : obstacle.texture;

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

    this.minimap.render(this.actor.position);
  }
}
