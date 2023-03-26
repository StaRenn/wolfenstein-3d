import { ActorStats, ItemPurpose, Weapons } from '../types';
import { fillWeaponFrameSet } from '../helpers/frameSets';
import { getImageWithSource } from '../utils/getImageWithSource';
import { toRadians } from '../helpers/maths';

export const TILE_SIZE = 10;
export const RAY_LENGTH = TILE_SIZE * 64;
export const DOOR_TIMEOUT = 4000;
export const DOOR_IDS = [27, 28, 33, 34, 35, 36];
export const DOOR_SIDE_WALL_TEXTURE_ID = 30;
export const DOOR_SIDE_WALL_TEXTURE_DARK_ID = 29;
export const TEXTURE_SIZE = 64;
export const HUD_WIDTH_COEFFICIENT = 0.6;
export const MAP_SCALE = 0.6;
export const DEFAULT_FRAME_DURATION = 1000 / 60;
export const OBSTACLES_MOVE_SPEED = TILE_SIZE / (TILE_SIZE * 4);
export const ACTOR_SPEED = 1;
// 1 / RESOLUTION_SCALE must return integer value, because we cant render 0.1 of pixel, 0.5 of pixel etc
export const RESOLUTIONS_SCALE_VALUES = [0.1, 0.25, 0.5, 1] as const;

// globals
// DO NOT SET MORE THAN 1
window.RESOLUTION_SCALE = 1;
window.IS_PAUSED = false;
window.FOV_DEGREES = 90;
window.FOV = toRadians(FOV_DEGREES);
window.TIME_SCALE = 1;

export const WEAPONS: Weapons = {
  KNIFE: {
    frameSet: fillWeaponFrameSet('KNIFE', 50),
    maxDistance: 10,
    damage: 10,
    frameDuration: 50,
    ammoPerAttack: 0,
    shootFrameIdx: 2,
    icon: getImageWithSource('src/assets/hud/knife.png'),
  },
  PISTOL: {
    frameSet: fillWeaponFrameSet('PISTOL', 65),
    maxDistance: 70,
    damage: 40,
    frameDuration: 65,
    ammoPerAttack: 1,
    shootFrameIdx: 2,
    icon: getImageWithSource('src/assets/hud/pistol.png'),
  },
  MACHINE_GUN: {
    frameSet: fillWeaponFrameSet('MACHINE_GUN', 25),
    maxDistance: 70,
    damage: 20,
    frameDuration: 25,
    ammoPerAttack: 1,
    shootFrameIdx: 2,
    icon: getImageWithSource('src/assets/hud/machine_gun.png'),
  },
};

export const ITEMS_PURPOSES: { readonly [key: number]: ItemPurpose<ActorStats> } = {
  34: {
    affects: 'ammo',
    value: 8,
  },
  35: {
    affects: 'health',
    value: 10,
  },
  39: {
    affects: 'health',
    value: 25,
  },
  36: {
    affects: 'score',
    value: 100,
  },
  37: {
    affects: 'score',
    value: 1,
  },
  38: {
    affects: 'score',
    value: 500,
  },
  42: {
    affects: 'score',
    value: 1000,
  },
  40: {
    affects: 'weapons',
    value: 'MACHINE_GUN',
  },
  41: {
    affects: 'weapons',
    value: 'MACHINE_GUN', //todo minigun
  },
} as const;

export const INTERSECTION_TYPES = {
  VERTICAL: 'VERTICAL',
  HORIZONTAL: 'HORIZONTAL',
} as const;

export const OBSTACLE_SIDES = {
  TOP: 'TOP',
  BOTTOM: 'BOTTOM',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
} as const;

export const NEIGHBOR_OFFSET = {
  [OBSTACLE_SIDES.TOP]: -1,
  [OBSTACLE_SIDES.BOTTOM]: 1,
  [OBSTACLE_SIDES.LEFT]: -1,
  [OBSTACLE_SIDES.RIGHT]: 1,
} as const;
