import type { DoorObstacle } from 'src/models/obstacles/Door';
import type { ItemObstacle } from 'src/models/obstacles/Item';
import type { SpriteObstacle } from 'src/models/obstacles/Sprite';
import type { WallObstacle } from 'src/models/obstacles/Wall';

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
  minDamage: number;
  maxDamage: number;
  frameDuration: number;
  ammoPerAttack: number;
  shootFrameIdx: number;
  icon: HTMLImageElement;
};

export type Weapons = Record<WeaponType, Weapon>;

export type ScreenData = {
  height: number;
  width: number;
};

export type ActorStats = 'ammo' | 'health' | 'score' | 'lives' | 'weapons';

// todo keys
export type ItemPurpose =
  | {
      affects: 'ammo' | 'health' | 'score' | 'lives';
      value: number;
    }
  | {
      affects: 'weapons';
      value: WeaponType;
    };

export type Intersection<T extends DoorObstacle | ItemObstacle | WallObstacle | SpriteObstacle> = {
  intersectionVertex: Vertex;
  obstacle: T;
  distance: number;
};

export type IndexedIntersection<
  T extends DoorObstacle | ItemObstacle | WallObstacle | SpriteObstacle
> = Intersection<T> & { index: number; layer: number };

export type Chunk = {
  startTextureOffsetX: number;
  startIndex: number;
  width: number;
  isInitial: boolean;
  rays: IndexedIntersection<DoorObstacle | ItemObstacle | WallObstacle | SpriteObstacle>[];
};

export type Frame<T> = {
  data: T;
  duration: number;
};

export type EnemyDirections = readonly [
  'FRONT',
  'FRONT_RIGHT',
  'RIGHT',
  'BACK_LEFT',
  'BACK',
  'BACK_RIGHT',
  'LEFT',
  'FRONT_LEFT'
];

export type EntityFrameSetByAction = {
  IDLE: Record<EnemyDirections[number], Frame<HTMLImageElement>[]>;
  WANDER: Record<EnemyDirections[number], Frame<HTMLImageElement>[]>;
  CHASE: Record<EnemyDirections[number], Frame<HTMLImageElement>[]>;
  ATTACK: Frame<HTMLImageElement>[];
  DIE: Frame<HTMLImageElement>[];
  TAKING_DAMAGE: Frame<HTMLImageElement>[];
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
