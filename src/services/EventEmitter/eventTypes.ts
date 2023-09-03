import type { GameMap } from 'src/entities/GameMap';
import type { EnemyAI } from 'src/entities/actors/abstract/EnemyAI';

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
  wolfWeaponChange: WeaponType;
  wolfInteract: undefined;
  wolfPositionChange: Vertex;
  wolfMatrixPositionChange: Vertex;
  // Enemy
  enemyHit: EnemyAI;
  enemyDie: EnemyAI;
};
