// 1 / RESOLUTION_SCALE must return integer value, because we cant render floating pixels
let RESOLUTIONS_SCALE_VALUES = [0.1, 0.25, 0.5, 1] as const;
// DO NOT SET MORE THAN 1
let RESOLUTION_SCALE: typeof RESOLUTIONS_SCALE_VALUES[number] = 1;

let IS_PAUSED = false;
let FOV_DEGREES = 90;
let FOV = (FOV_DEGREES * Math.PI) / 180;

const TILE_SIZE = 10;
const RAY_LENGTH = TILE_SIZE * 64;
const ACTOR_SPEED = 1;
const DOOR_TIMEOUT = 4000;
const DOOR_IDS = [27, 28, 33, 34, 35, 36];
const OBSTACLES_MOVE_SPEED = TILE_SIZE / (TILE_SIZE * 4);
const TEXTURE_SIZE = 64;
const HUD_WIDTH_COEFFICIENT = 0.6;
const MAP_SCALE = 0.6;

const WEAPONS: Weapons = {
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

const ITEMS_PURPOSES: { readonly [key: number]: ItemPurpose<ActorStats> } = {
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

const INTERSECTION_TYPES = {
  VERTICAL: 'VERTICAL',
  HORIZONTAL: 'HORIZONTAL',
} as const;

const OBSTACLE_SIDES = {
  TOP: 'TOP',
  BOTTOM: 'BOTTOM',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
} as const;

const NEIGHBOR_OFFSET = {
  [OBSTACLE_SIDES.TOP]: -1,
  [OBSTACLE_SIDES.BOTTOM]: 1,
  [OBSTACLE_SIDES.LEFT]: -1,
  [OBSTACLE_SIDES.RIGHT]: 1,
} as const;
