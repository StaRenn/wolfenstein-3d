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

type ObstacleParams = {
  matrixCoordinates: Vertex;
  initialPosition: Vector;
  position: Vector;
  endPosition: Vector;
  textureId: number;
  isDoor: boolean;
  isInFinalPosition: boolean;
  isInStartPosition: boolean;
  isSecret: boolean;
  isVertical: boolean;
  isMovable: boolean;
  isMoving: boolean;
  isSprite: boolean;
  isItem: boolean;
  hasCollision: boolean;
  rawValue: string | number;
  closeTimeout: null | Timeout;
  purpose: null | ItemPurpose<ActorStats>;
};

type Plane = {
  position: Vector;
  type: keyof typeof INTERSECTION_TYPES;
  shouldReverseTexture: boolean;
  textureId: number;
  isMovable: boolean;
  isSprite: boolean;
  isVisible: boolean;
  isItem: boolean;
  hasCollision: boolean;
  purpose: null | ItemPurpose<ActorStats>;
};

type Wall = Omit<Plane, 'isSprite' | 'isItem' | 'purpose'> & { isSprite: false; isItem: false; purpose: null };
type Sprite = Omit<Plane, 'isSprite'> & { isSprite: true };
type Item = Omit<Plane, 'isSprite' | 'hasCollision' | 'purpose' | 'isItem'> & {
  isSprite: true;
  hasCollision: false;
  purpose: ItemPurpose<ActorStats>;
  isItem: true;
};

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

type PreparedNeighbor = {
  isDoor: boolean;
  isSecret: boolean;
  isMovable: boolean;
  number: number;
};

type ActorStats = 'ammo' | 'health' | 'score' | 'lives' | 'weapons' | 'keys';

// todo keys
type ItemPurpose<T extends ActorStats> = {
  affects: T;
  value: T extends 'ammo' | 'health' | 'score' | 'lives' ? number : WeaponType;
};

type Intersection<T extends Wall | Sprite | Plane = Plane> = {
  intersectionVertex: Vertex;
  plane: T;
  distance: number;
};

type IndexedIntersection<T extends Wall | Sprite | Plane = Plane> = Intersection<T> & { index: number };

type Chunk = {
  startIndex: number;
  width: number;
  isInitial: boolean;
  rays: IndexedIntersection[];
};

type Frame<T> = {
  data: T;
  duration: number;
};

type PostEffectFrame = Frame<{ color: string }>;

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

const isSprite = (plane: Wall | Sprite | Plane | Item): plane is Sprite => {
  return plane.isSprite;
};

const isWall = (plane: Wall | Sprite | Plane | Item): plane is Wall => {
  return !plane.isSprite;
};

const isItem = (plane: Wall | Sprite | Plane | Item): plane is Item => {
  return plane.isItem;
};

const isItemObstacle = (
  obstacle: Obstacle
): obstacle is Omit<Obstacle, 'isSprite' | 'hasCollision' | 'purpose' | 'isItem'> & {
  isSprite: true;
  hasCollision: false;
  purpose: ItemPurpose<ActorStats>;
  isItem: true;
} => {
  return obstacle.isItem;
};

// todo rename
const isDesiredPurpose = <T extends ActorStats>(
  purpose: ItemPurpose<ActorStats>,
  type: T
): purpose is ItemPurpose<T> => {
  return purpose.affects === type;
};
