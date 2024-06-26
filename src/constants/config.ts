import { fillWeaponFrameSet } from 'src/utils/frameSets';
import { getImageWithSource } from 'src/utils/getImageWithSource';
import { toRadians } from 'src/utils/maths';

import type { ItemPurpose, Vertex, Weapons } from 'src/types';

// core, do not change
export const TILE_SIZE = 10;
export const DEVICE_PIXEL_RATIO = window.devicePixelRatio;
export const HALF_TILE_SIZE = TILE_SIZE / 2;
export const RAY_LENGTH = TILE_SIZE * 48;
export const DOOR_IDS = [27, 28, 33, 34, 35, 36];
export const AMMO_ID = 34;
export const DOOR_SIDE_WALL_TEXTURE_ID = 30;
export const DOOR_SIDE_WALL_TEXTURE_DARK_ID = 29;
export const TEXTURE_SIZE = 64;
export const DEFAULT_FRAME_DURATION = 1000 / 60;
export const RESOLUTIONS_SCALE_VALUES = [0.5, 1] as const;

// secondary
export const DOOR_TIMEOUT = 4000;
export const HUD_WIDTH_COEFFICIENT = 0.6;
export const MAP_SCALE = 0.6;
export const OBSTACLES_MOVE_SPEED = TILE_SIZE / (TILE_SIZE * 4);
export const ACTOR_SPEED = 1;
export const ENEMY_FOV = toRadians(120);
export const WOLF_ATTACK_FOV = toRadians(15);

// defaults
// 1 / RESOLUTION_SCALE must return integer value, because we cant render 0.1 of pixel, 0.5 of pixel etc
export const DEFAULT_FOV_DEGREES = 90;
export const DEFAULT_FOV = toRadians(DEFAULT_FOV_DEGREES);
// DO NOT SET MORE THAN 1
export const DEFAULT_RESOLUTION_SCALE: typeof RESOLUTIONS_SCALE_VALUES[number] = 0.5;

// globals
window.TIME_SCALE = 1;

export const WEAPONS: Weapons = {
  KNIFE: {
    frameSet: fillWeaponFrameSet('KNIFE', 50),
    maxDistance: TILE_SIZE * 2,
    minDamage: 50,
    maxDamage: 50,
    frameDuration: 50,
    ammoPerAttack: 0,
    attackFrameIdx: 2,
    noiseDistance: 0,
    icon: getImageWithSource('src/static/assets/hud/knife.png'),
  },
  PISTOL: {
    frameSet: fillWeaponFrameSet('PISTOL', 65),
    maxDistance: TILE_SIZE * 20,
    minDamage: 25,
    maxDamage: 100,
    frameDuration: 65,
    ammoPerAttack: 1,
    attackFrameIdx: 2,
    noiseDistance: TILE_SIZE * 6,
    icon: getImageWithSource('src/static/assets/hud/pistol.png'),
  },
  MACHINE_GUN: {
    frameSet: fillWeaponFrameSet('MACHINE_GUN', 30),
    maxDistance: TILE_SIZE * 20,
    minDamage: 20,
    maxDamage: 55,
    frameDuration: 30,
    ammoPerAttack: 1,
    attackFrameIdx: 2,
    noiseDistance: TILE_SIZE * 10,
    icon: getImageWithSource('src/static/assets/hud/machine_gun.png'),
  },
};

export const ITEMS_PURPOSES: { readonly [key: number]: ItemPurpose } = {
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
    value: 'MACHINE_GUN', // todo minigun
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

export const OBSTACLE_CORNERS = {
  TOP_LEFT: 'TOP_LEFT',
  TOP_RIGHT: 'TOP_RIGHT',
  BOTTOM_LEFT: 'BOTTOM_LEFT',
  BOTTOM_RIGHT: 'BOTTOM_RIGHT',
} as const;

export const NEIGHBOR_OFFSET: Record<keyof typeof OBSTACLE_SIDES, Vertex> = {
  [OBSTACLE_SIDES.TOP]: { x: 0, y: -1 },
  [OBSTACLE_SIDES.BOTTOM]: { x: 0, y: 1 },
  [OBSTACLE_SIDES.LEFT]: { x: -1, y: 0 },
  [OBSTACLE_SIDES.RIGHT]: { x: 1, y: 0 },
} as const;

export const NEIGHBOR_OFFSET_WITH_CORNERS: Record<
  keyof typeof OBSTACLE_CORNERS | keyof typeof NEIGHBOR_OFFSET,
  Vertex
> = {
  ...NEIGHBOR_OFFSET,
  [OBSTACLE_CORNERS.TOP_LEFT]: { x: -1, y: -1 },
  [OBSTACLE_CORNERS.TOP_RIGHT]: { x: 1, y: -1 },
  [OBSTACLE_CORNERS.BOTTOM_LEFT]: { x: -1, y: 1 },
  [OBSTACLE_CORNERS.BOTTOM_RIGHT]: { x: 1, y: 1 },
};

export const NEIGHBORS_NEXT_TO_CORNERS = {
  [OBSTACLE_CORNERS.TOP_LEFT]: [NEIGHBOR_OFFSET.BOTTOM, NEIGHBOR_OFFSET.RIGHT],
  [OBSTACLE_CORNERS.TOP_RIGHT]: [NEIGHBOR_OFFSET.BOTTOM, NEIGHBOR_OFFSET.LEFT],
  [OBSTACLE_CORNERS.BOTTOM_LEFT]: [NEIGHBOR_OFFSET.TOP, NEIGHBOR_OFFSET.RIGHT],
  [OBSTACLE_CORNERS.BOTTOM_RIGHT]: [NEIGHBOR_OFFSET.TOP, NEIGHBOR_OFFSET.LEFT],
} as const;

export const ENEMY_FACING_DIRECTION_MAP = {
  WEST: 0,
  NORTH: 90,
  EAST: 180,
  SOUTH: -90,
} as const;
