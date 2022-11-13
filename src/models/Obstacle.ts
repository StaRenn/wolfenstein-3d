class Obstacle {
  public readonly textureId: number;
  public readonly isDoor: boolean;
  public readonly isSecret: boolean;
  public readonly isVertical: boolean;
  public readonly isMovable: boolean;
  public readonly isSprite: boolean;
  public readonly isItem: boolean;
  public readonly rawValue: string | number;
  public readonly purpose: null | ItemPurpose<ActorStats>;

  public matrixCoordinates: Vertex;
  public initialPosition: Vector;
  public position: Vector;
  public endPosition: Vector;
  public closeTimeout: null | Timeout;
  public hasCollision: boolean;
  public isMoving: boolean;
  public isInFinalPosition: boolean;
  public isInStartPosition: boolean;

  constructor(params: ObstacleParams) {
    this.textureId = params.textureId;
    this.isDoor = params.isDoor;
    this.isSecret = params.isSecret;
    this.isVertical = params.isVertical;
    this.isMovable = params.isMovable;
    this.isSprite = params.isSprite;
    this.isItem = params.isItem;
    this.rawValue = params.rawValue;
    this.purpose = params.purpose;

    this.matrixCoordinates = params.matrixCoordinates;
    this.initialPosition = params.initialPosition;
    this.position = params.position;
    this.endPosition = params.endPosition;
    this.closeTimeout = params.closeTimeout;
    this.hasCollision = params.hasCollision;
    this.isMoving = params.isMoving;
    this.isInFinalPosition = params.isInFinalPosition;
    this.isInStartPosition = params.isInStartPosition;
  }

  getWallVectorFromObstacle(obstacle: Obstacle, planePosition: keyof typeof OBSTACLE_SIDES): Vector {
    const obstaclePos = obstacle.position;
    const isDoor = obstacle.isDoor;

    return {
      x1: obstaclePos.x1 + (planePosition === OBSTACLE_SIDES.RIGHT && !isDoor ? TILE_SIZE : 0),
      y1: obstaclePos.y1 + (planePosition === OBSTACLE_SIDES.BOTTOM && !isDoor ? TILE_SIZE : 0),
      x2: obstaclePos.x2 - (planePosition === OBSTACLE_SIDES.LEFT && !isDoor ? TILE_SIZE : 0),
      y2: obstaclePos.y2 - (planePosition === OBSTACLE_SIDES.TOP && !isDoor ? TILE_SIZE : 0),
    };
  }

  getSpriteFromObstacle(obstacle: Obstacle, angle: number): Sprite {
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

    let spriteAngle = -angle;

    coordinates.x1 = middleVertex.x + (TILE_SIZE / 2) * Math.cos(spriteAngle);
    coordinates.y1 = middleVertex.y + (TILE_SIZE / 2) * Math.sin(spriteAngle);
    coordinates.x2 = middleVertex.x - (TILE_SIZE / 2) * Math.cos(spriteAngle);
    coordinates.y2 = middleVertex.y - (TILE_SIZE / 2) * Math.sin(spriteAngle);

    return {
      position: coordinates,
      type: INTERSECTION_TYPES.HORIZONTAL,
      shouldReverseTexture: true,
      textureId: obstacle.textureId,
      isMovable: false,
      isSprite: true,
      isVisible: true,
      isItem: obstacle.isItem,
      hasCollision: obstacle.hasCollision,
      purpose: obstacle.purpose,
    };
  }

  getWallFromObstacle(obstacle: Obstacle, type: keyof typeof OBSTACLE_SIDES, neighbor: PreparedNeighbor | null): Wall {
    const isVertical = type === OBSTACLE_SIDES.TOP || type === OBSTACLE_SIDES.BOTTOM;

    let textureId = obstacle.textureId;

    if (neighbor?.isDoor) {
      textureId = isVertical ? 30 : 29;
    }

    return {
      position: this.getWallVectorFromObstacle(obstacle, type),
      type: isVertical ? INTERSECTION_TYPES.VERTICAL : INTERSECTION_TYPES.HORIZONTAL,
      shouldReverseTexture: !neighbor?.isDoor && (type === OBSTACLE_SIDES.LEFT || type === OBSTACLE_SIDES.BOTTOM),
      textureId: textureId,
      isMovable: obstacle.isMovable,
      isVisible: !obstacle.isSprite,
      isSprite: false,
      isItem: false,
      hasCollision: obstacle.hasCollision,
      purpose: null,
    };
  }

  getNeighbors(map: (Obstacle | null)[][]) {
    const neighbors: Record<keyof typeof OBSTACLE_SIDES, null | PreparedNeighbor> = {
      [OBSTACLE_SIDES.TOP]: null,
      [OBSTACLE_SIDES.LEFT]: null,
      [OBSTACLE_SIDES.BOTTOM]: null,
      [OBSTACLE_SIDES.RIGHT]: null,
    };

    Object.keys(neighbors).forEach((side: keyof typeof OBSTACLE_SIDES, i) => {
      const offset = NEIGHBOR_OFFSET[side];

      const axisY = map[this.matrixCoordinates.y + (1 - (i % 2)) * offset];

      if (axisY) {
        const axisXValue = axisY[this.matrixCoordinates.x + (i % 2) * offset];

        if (axisXValue) {
          const isDoor = typeof axisXValue.rawValue === 'number' && DOOR_IDS.includes(axisXValue.rawValue);
          const isSecret = typeof axisXValue.rawValue === 'string';

          neighbors[side] = {
            isDoor,
            isSecret,
            isMovable: isDoor || isSecret,
            number:
              typeof axisXValue.rawValue === 'number' ? axisXValue.rawValue : Number(axisXValue.rawValue.split('_')[0]),
          };
        }
      }
    });

    return neighbors;
  }
}
