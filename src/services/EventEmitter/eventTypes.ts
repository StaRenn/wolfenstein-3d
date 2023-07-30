import type { Enemy } from 'src/entities/actors/abstract/Enemy';

import type { ScreenData, Vertex, WeaponType } from 'src/types';

export type Events = {
  // Game
  fovChange: number;
  resize: ScreenData;
  frameUpdate: undefined;
  resolutionScaleChange: number;
  // Wolf
  wolfBoostPickup: undefined;
  wolfAttack: undefined;
  wolfWeaponChange: WeaponType;
  wolfInteract: undefined;
  wolfPositionChange: Vertex;
  wolfMatrixPositionChange: Vertex;
  // Enemy
  enemyHit: Enemy;
  enemyDie: Enemy;
};
