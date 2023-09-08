import { getImageWithSource } from 'src/utils/getImageWithSource';

import type {
  EnemyDirectedFrameSet,
  EnemyDirections,
  EnemyFrameSetByAction,
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

export function fillWeaponFrameSet(weaponType: WeaponType, duration: number): Frame<HTMLImageElement>[] {
  const frameSet = [];

  for (let i = 0; i < 5; i++) {
    frameSet.push(
      getImageWithSource(
        `src/static/assets/weapons/${weaponType.toLowerCase()}/${weaponType.toLowerCase()}_frame_${i}.png`
      )
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

export function getEnemyFrameSetByState(type: 'guard'): EnemyDirectedFrameSet {
  const frameSet: EnemyDirectedFrameSet = {
    IDLE: fillDirection<Frame<HTMLImageElement>>(),
    RUN: fillDirection<Frame<HTMLImageElement>>(),
  };

  for (const key of ENEMY_DIRECTIONS) {
    frameSet.IDLE[key].push({
      data: getImageWithSource(`src/static/assets/enemies/${type}/idle/${key.toLowerCase()}_0.png`),
      duration: Infinity,
    });
  }

  for (const key of ENEMY_DIRECTIONS) {
    for (let i = 0; i < 4; i++) {
      frameSet.RUN[key].push({
        data: getImageWithSource(`src/static/assets/enemies/${type}/run/${key.toLowerCase()}_${i}.png`),
        duration: 200,
      });
    }
  }

  return frameSet;
}

export function getEnemyFrameSetByAction(type: 'guard'): EnemyFrameSetByAction {
  const frameSet: EnemyFrameSetByAction = {
    SHOOT: [],
    TAKE_DAMAGE: [],
    DIE: [],
  };

  frameSet.TAKE_DAMAGE.push({
    data: getImageWithSource(`src/static/assets/enemies/${type}/take_damage/0.png`),
    duration: 150,
  });

  for (let i = 0; i <= 2; i++) {
    frameSet.SHOOT.push({
      data: getImageWithSource(`src/static/assets/enemies/${type}/shoot/${i}.png`),
      duration: 150,
    });
  }

  for (let i = 0; i <= 4; i++) {
    frameSet.DIE.push({
      data: getImageWithSource(`src/static/assets/enemies/${type}/die/${i}.png`),
      duration: i === 4 ? Infinity : 100,
    });
  }

  return frameSet;
}

export function fillPortraitFrameSet(condition: keyof HealthFrameSets): Frame<HTMLImageElement>[] {
  const frameSet = [];

  for (let i = 0; i < 3; i++) {
    frameSet.push(getImageWithSource(`src/static/assets/hud/portrait/${condition.toLowerCase()}/frame_${i}.png`));
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
