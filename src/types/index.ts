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
  initialPosition: Vector;
  position: Vector;
  endPosition: Vector;
  textureId: number;
  isDoor: boolean;
  isInStartPosition: boolean;
  isSecret: boolean;
  isVertical: boolean;
  isMovable: boolean;
  isSprite: boolean;
  isCollecting: boolean;
  hasCollision: boolean;
  closeTimeout: null | Timeout;
};

type Plane = {
  position: Vector;
  type: keyof typeof INTERSECTION_TYPES;
  shouldReverseTexture: boolean;
  textureId: number;
  isMovable: boolean;
  isSprite: boolean;
  isVisible: boolean;
  hasCollision: boolean;
  obstacleIdx: number;
};

type Wall = Omit<Plane, 'isSprite'> & { isSprite: false };
type Sprite = Omit<Plane, 'isSprite'> & { isSprite: true };

type WeaponType = 'KNIFE' | 'PISTOL' | 'MACHINE_GUN';

type Weapon = {
  frameSet: Frame<HTMLImageElement>[];
  maxDistance: number;
  damage: number;
  frameDuration: number;
  ammoPerAttack: number;
  shootFrameIdx: number;
  icon: HTMLImageElement;
};

type Weapons = { readonly [key in WeaponType]: Weapon };

type ScreenData = {
  screenHeight: number;
  screenWidth: number;
};

type ObstaclesVectorsByPurposes = {
  walls: Wall[];
  sprites: Sprite[];
  collisionObstacles: Plane[];
};

type PreparedNeighbor = {
  isDoor: boolean;
  isSecret: boolean;
  isMovable: boolean;
  number: number;
};

type Intersection<T extends Wall | Sprite | Plane = Plane> = {
  x: number;
  y: number;
  plane: T;
  distance: number;
};

type IndexedIntersection<T extends Wall | Sprite | Plane = Plane> = Intersection<T> & { index: number };

type Frame<Data> = {
  data: Data;
  duration: number;
};

type HealthFrameSetName =
  | 'SEVERE_DAMAGE'
  | 'JUST_A_SCRATCH'
  | 'NEAR_DEATH'
  | 'MODERATE_DAMAGE'
  | 'HEALTHY'
  | 'DEAD'
  | 'SUFFERING'
  | 'MINOR_DAMAGE';

type HealthFrameSets = { [key in HealthFrameSetName]: Frame<HTMLImageElement>[] };

const isSprite = (plane: Wall | Sprite | Plane): plane is Sprite => {
  return plane.isSprite;
};
const isWall = (plane: Wall | Sprite | Plane): plane is Wall => {
  return !plane.isSprite;
};
