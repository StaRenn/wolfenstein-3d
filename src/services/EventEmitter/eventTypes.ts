import type { GameMap } from 'src/entities/GameMap';
import type { Enemy } from 'src/entities/actors/abstract/Enemy';

import type { ScreenData, Vertex, Weapon, WeaponType } from 'src/types';

export type Events = {
  // Game
  fovChange: number;
  resize: ScreenData;
  frameUpdate: undefined;
  resolutionScaleChange: number;
  gameMapReady: GameMap;
  // Wolf
  wolfBoostPickup: undefined;
  wolfAttack: Weapon;
  wolfHit: number;
  wolfDie: undefined;
  wolfWeaponChange: WeaponType;
  wolfInteract: undefined;
  wolfPositionChange: Vertex;
  wolfMatrixPositionChange: Vertex;
  // Enemy
  enemyHit: Enemy;
  enemyDie: Enemy;
};
