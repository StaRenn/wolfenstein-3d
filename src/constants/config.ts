const TILE_SIZE = 10;
const RAY_LENGTH = TILE_SIZE * 35;
const ACTOR_SPEED = 1;
const DOOR_IDS = [27, 28, 33, 34];
const STATIC_DOORS_IDS = [33]
const OBSTACLES_MOVE_SPEED = TILE_SIZE / (TILE_SIZE * 4);
const TEXTURE_SIZE = 64;
const TEXTURE_SCALE = TEXTURE_SIZE / TILE_SIZE;
const HUD_WIDTH_COEFFICIENT = 0.75;

const ITEMS_PURPOSES: {readonly [key: number]: ItemPurpose<ActorStats>} = {
  34: {
    affects: "ammo",
    value: 8,
  },
  35: {
    affects: "health",
    value: 10
  },
  39: {
    affects: "health",
    value: 25
  },
  36: {
    affects: "score",
    value: 100
  },
  37: {
    affects: "score",
    value: 1
  },
  38: {
    affects: "score",
    value: 500
  },
  42: {
    affects: "score",
    value: 1000
  },
  40: {
    affects: 'weapons',
    value: "MACHINE_GUN",
  },
  41: {
    affects: 'weapons',
    value: "MACHINE_GUN", //todo minigun
  }
} as const

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
  [OBSTACLE_SIDES.TOP]: -TILE_SIZE,
  [OBSTACLE_SIDES.BOTTOM]: TILE_SIZE,
  [OBSTACLE_SIDES.LEFT]: -TILE_SIZE,
  [OBSTACLE_SIDES.RIGHT]: TILE_SIZE,
} as const;
