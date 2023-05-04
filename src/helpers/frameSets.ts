import { getImageWithSource } from 'src/utils/getImageWithSource';

import type {
  EnemyDirections,
  EntityFrameSetByAction,
  Frame,
  HealthFrameSets,
  PostEffectFrame,
  WeaponType,
} from 'src/types';

const ENEMY_DIRECTIONS: EnemyDirections = [
  'FRONT',
  'FRONT_RIGHT',
  'RIGHT',
  'BACK_LEFT',
  'BACK',
  'BACK_RIGHT',
  'LEFT',
  'FRONT_LEFT',
] as const;

export const NON_DIRECTED_FRAME_SETS_BY_ACTION: (keyof Pick<
  EntityFrameSetByAction,
  'ATTACK' | 'DIE' | 'TAKING_DAMAGE'
>)[] = ['ATTACK', 'DIE', 'TAKING_DAMAGE'];

export const DIRECTED_FRAME_SETS_BY_ACTION: (keyof Pick<EntityFrameSetByAction, 'IDLE' | 'WANDER' | 'CHASE'>)[] = [
  'IDLE',
  'WANDER',
  'CHASE',
];

export function fillWeaponFrameSet(weaponType: WeaponType, duration: number): Frame<HTMLImageElement>[] {
  const frameSet = [];

  for (let i = 0; i < 5; i++) {
    frameSet.push(
      getImageWithSource(`src/assets/weapons/${weaponType.toLowerCase()}/${weaponType.toLowerCase()}_frame_${i}.png`)
    );
  }

  return frameSet.map((frame) => ({
    data: frame,
    duration,
  }));
}

export function fillDirection<T>() {
  return ENEMY_DIRECTIONS.reduce((acc, key) => {
    acc[key as EnemyDirections[number]] = [];

    return acc;
  }, {} as Record<EnemyDirections[number], T[]>);
}

export function getEnemyFrameSet(type: 'guard'): EntityFrameSetByAction {
  const frameSet: EntityFrameSetByAction = {
    IDLE: fillDirection<Frame<HTMLImageElement>>(),
    WANDER: fillDirection<Frame<HTMLImageElement>>(),
    CHASE: fillDirection<Frame<HTMLImageElement>>(),
    ATTACK: [] as Frame<HTMLImageElement>[],
    DIE: [] as Frame<HTMLImageElement>[],
    TAKING_DAMAGE: [] as Frame<HTMLImageElement>[],
  };

  frameSet.TAKING_DAMAGE.push({
    data: getImageWithSource(`src/assets/enemies/${type}/taking_damage/0.png`),
    duration: 150,
  });

  for (const key of ENEMY_DIRECTIONS) {
    frameSet.IDLE[key].push({
      data: getImageWithSource(`src/assets/enemies/${type}/idle/${key.toLowerCase()}_0.png`),
      duration: Infinity,
    });
  }

  for (let i = 0; i <= 2; i++) {
    frameSet.ATTACK.push({
      data: getImageWithSource(`src/assets/enemies/${type}/attack/${i}.png`),
      duration: 150,
    });
  }

  for (let i = 0; i <= 4; i++) {
    frameSet.DIE.push({
      data: getImageWithSource(`src/assets/enemies/${type}/die/${i}.png`),
      duration: i === 4 ? Infinity : 100,
    });
  }

  return frameSet;
}

export function fillPortraitFrameSet(condition: keyof HealthFrameSets): Frame<HTMLImageElement>[] {
  const frameSet = [];

  for (let i = 0; i < 3; i++) {
    frameSet.push(getImageWithSource(`src/assets/hud/portrait/${condition.toLowerCase()}/frame_${i}.png`));
  }

  return [
    {
      data: frameSet[0],
      duration: 2000,
    },
    {
      data: frameSet[1],
      duration: 750,
    },
    {
      data: frameSet[2],
      duration: 750,
    },
    {
      data: frameSet[1],
      duration: 750,
    },
    {
      data: frameSet[0],
      duration: 1500,
    },
    {
      data: frameSet[1],
      duration: 1500,
    },
    {
      data: frameSet[2],
      duration: 200,
    },
    {
      data: frameSet[1],
      duration: 500,
    },
    {
      data: frameSet[2],
      duration: 500,
    },
    {
      data: frameSet[1],
      duration: 500,
    },
  ];
}

export function generatePostEffectFrameSet(color: [number, number, number]): PostEffectFrame[] {
  return [
    {
      data: { color: `rgba(${color.join(',')}, 0)` },
      duration: 10000,
    },
    {
      data: { color: `rgba(${color.join(',')}, 0.25)` },
      duration: 40,
    },
    {
      data: { color: `rgba(${color.join(',')}, 0.2)` },
      duration: 40,
    },
    {
      data: { color: `rgba(${color.join(',')}, 0.15)` },
      duration: 40,
    },
    {
      data: { color: `rgba(${color.join(',')}, 0.1)` },
      duration: 40,
    },
    {
      data: { color: `rgba(${color.join(',')}, 0.05)` },
      duration: 40,
    },
  ];
}
