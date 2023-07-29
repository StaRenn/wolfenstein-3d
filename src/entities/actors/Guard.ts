import { Enemy, EnemyParams } from 'src/entities/actors/abstract/Enemy';

import { getEnemyFrameSet } from 'src/utils/frameSets';

export type GuardParams = Omit<EnemyParams, 'frameSet' | 'health' | 'maxHealth' | 'currentWeapon'>;

export class Guard extends Enemy {
  constructor(params: GuardParams) {
    super({
      ...params,
      currentWeapon: 'PISTOL',
      health: 100,
      maxHealth: 100,
      frameSet: getEnemyFrameSet('guard'),
    });
  }
}
