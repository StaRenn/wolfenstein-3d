import { DoorObstacle } from '../models/obstacles/Door';
import { WallObstacle } from '../models/obstacles/Wall';
import { SpriteObstacle } from '../models/obstacles/Sprite';
import { ItemObstacle } from '../models/obstacles/Item';

export type RawMap = (string | number)[][];

export type ParsedMap = (DoorObstacle | ItemObstacle | WallObstacle | SpriteObstacle | null)[][];

export type Vertex = {
  x: number;
  y: number;
};

export type Vector = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

export type Triangle = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  x3: number;
  y3: number;
};

export type Obstacle = DoorObstacle | ItemObstacle | WallObstacle | SpriteObstacle;

export type WeaponType = 'KNIFE' | 'PISTOL' | 'MACHINE_GUN';

export type Weapon = {
  frameSet: Frame<HTMLImageElement>[];
  maxDistance: number;
  damage: number;
  frameDuration: number;
  ammoPerAttack: number;
  shootFrameIdx: number;
  icon: HTMLImageElement;
};

export type Weapons = { readonly [key in WeaponType]: Weapon };

export type ScreenData = {
  screenHeight: number;
  screenWidth: number;
};

export type ActorStats = 'ammo' | 'health' | 'score' | 'lives' | 'weapons' | 'keys';

// todo keys
export type ItemPurpose<T extends ActorStats> = {
  affects: T;
  value: T extends 'ammo' | 'health' | 'score' | 'lives' ? number : WeaponType;
};

export type Intersection<T extends DoorObstacle | ItemObstacle | WallObstacle | SpriteObstacle> = {
  intersectionVertex: Vertex;
  obstacle: T;
  distance: number;
};

export type IndexedIntersection<
  T extends DoorObstacle | ItemObstacle | WallObstacle | SpriteObstacle
> = Intersection<T> & { index: number };

export type Chunk = {
  startIndex: number;
  width: number;
  isInitial: boolean;
  rays: IndexedIntersection<DoorObstacle | ItemObstacle | WallObstacle | SpriteObstacle>[];
};

export type Frame<T> = {
  data: T;
  duration: number;
};

export type PostEffectFrame = Frame<{ color: string }>;

export type HealthFrameSets = {
  SEVERE_DAMAGE: Frame<HTMLImageElement>[];
  JUST_A_SCRATCH: Frame<HTMLImageElement>[];
  NEAR_DEATH: Frame<HTMLImageElement>[];
  MODERATE_DAMAGE: Frame<HTMLImageElement>[];
  HEALTHY: Frame<HTMLImageElement>[];
  DEAD: Frame<HTMLImageElement>[];
  SUFFERING: Frame<HTMLImageElement>[];
  MINOR_DAMAGE: Frame<HTMLImageElement>[];
};
