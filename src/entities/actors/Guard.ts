import { Enemy, EnemyParams } from 'src/entities/actors/abstract/Enemy';

import { TILE_SIZE } from 'src/constants/config';

import { getEnemyFrameSetByAction, getEnemyFrameSetByState } from 'src/utils/frameSets';

export type GuardParams = Omit<
  EnemyParams,
  | 'stateFrameSet'
  | 'actionFrameSet'
  | 'health'
  | 'maxHealth'
  | 'currentWeapon'
  | 'speed'
  | 'viewDistance'
  | 'attackDistance'
  | 'attackDelayTime'
  | 'attackFrameIdx'
  | 'attackBaseDamage'
>;

export class Guard extends Enemy {
  constructor(params: GuardParams) {
    super({
      ...params,
      currentWeapon: 'PISTOL',
      health: 100,
      maxHealth: 100,
      speed: 0.4,
      viewDistance: TILE_SIZE * 20,
      attackDistance: TILE_SIZE * 12,
      attackDelayTime: 1000,
      attackBaseDamage: 30,
      attackFrameIdx: 2,
      stateFrameSet: getEnemyFrameSetByState('guard'),
      actionFrameSet: getEnemyFrameSetByAction('guard'),
    });
  }
}
