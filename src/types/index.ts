import type { DoorObstacle } from 'src/entities/obstacles/Door';
import type { ItemObstacle } from 'src/entities/obstacles/Item';
import type { SpriteObstacle } from 'src/entities/obstacles/Sprite';
import type { WallObstacle } from 'src/entities/obstacles/Wall';

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
  attackFrameIdx: number;
  noiseDistance: number;
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

export type EnemyTypes = 'guard';

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

export type EnemyState = 'IDLE' | 'ALERT' | 'ATTACK' | 'CHASE' | 'SEARCH';
export type EnemyAction = 'SHOOT' | 'TAKE_DAMAGE' | 'DIE';
export type DirectedFrameSets = 'IDLE' | 'RUN';

export type EnemyDirectedFrameSet = Record<
  DirectedFrameSets,
  Record<EnemyDirections[number], Frame<HTMLImageElement>[]>
>;
export type EnemyFrameSetByAction = Record<EnemyAction, Frame<HTMLImageElement>[]>;

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
