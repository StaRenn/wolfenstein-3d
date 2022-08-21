const map: GameMap = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, '1_SPRITE', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 0, '7_ID1_START', 0, '7_ID1_END', 1, 0, 0, 1, 27, 1, 0, 0, 0, 0, 27, 0, 0, 0, 0, 1],
  [1, 0, 0, 1, 27, 1, 1, 0, 0, 27, 0, 27, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 27, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 0, '7_ID3_START', 0, '7_ID3_END', 1, 0, 0, 1, 27, 1, 0, 0, 0, 0, 27, 0, 0, 0, 0, 1],
  [1, 0, 0, 1, 27, 1, 1, 0, 0, 27, 0, 27, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 27, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 0, '7_ID5_START', 0, '7_ID5_END', 1, 0, 0, 1, 27, 1, 0, 0, 0, 0, 27, 0, 0, 0, 0, 1],
  [1, 0, 0, 1, 27, 1, 1, 0, 0, 27, 0, 27, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 27, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 0, '7_ID7_START', 0, '7_ID7_END', 1, 0, 0, 1, 27, 1, 0, 0, 0, 0, 27, 0, 0, 0, 0, 1],
  [1, 0, 0, 1, 27, 1, 1, 0, 0, 27, 0, 27, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 27, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

// DO NOT SET MORE THAN 1
let RESOLUTION_SCALE = 1;
// 1 / RESOLUTION_SCALE must return integer value, because we cant render floating pixels
let RESOLUTIONS_SCALE_VALUES = [0.25, 0.5, 1];

let IS_PAUSED = false;

const TILE_SIZE = 10;
const RAY_LENGTH = TILE_SIZE * 100;
const ACTOR_SPEED = 1;
const ACTOR_START_POSITION = { x: TILE_SIZE * 1.5, y: TILE_SIZE * 1.5 };
const DOOR_IDS = [27, 28];
const FOV_DEGREES = 75;
const FOV = (FOV_DEGREES * Math.PI) / 180;
const OBSTACLES_MOVE_SPEED = TILE_SIZE / (TILE_SIZE * 4);
const TEXTURE_SIZE = 64;
const TEXTURE_SCALE = TEXTURE_SIZE / TILE_SIZE;

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
// global
const canvas = document.getElementById('canvas') as HTMLCanvasElement;

async function main() {
  const menu = document.getElementById('menu-container') as HTMLDivElement;
  const resolutionScaleRange = document.getElementById('resolution-scale') as HTMLInputElement;
  const continueButton = document.getElementById('continue-button') as HTMLButtonElement;

  continueButton.onclick = () => {
    if (IS_PAUSED) {
      IS_PAUSED = false;

      menu.style.display = 'none';
    }
  };

  resolutionScaleRange.onchange = (event: InputEvent) => {
    if (event.target) {
      RESOLUTION_SCALE = RESOLUTIONS_SCALE_VALUES[Number((event.target as HTMLInputElement).value)];

      handleResize();
      scene.render();
    }
  };

  canvas.onclick = () => {
    IS_PAUSED = false;

    canvas.requestPointerLock();
  };

  window.onkeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      IS_PAUSED = true;

      menu.style.display = 'flex';
    }
  };

  const scene = new Scene(canvas, map);

  {
    function handleResize() {
      scene.resize(window.innerWidth, window.innerHeight);
    }

    handleResize();
    window.addEventListener('resize', handleResize);
  }

  const fpsOut = document.getElementById('fps')!;
  let filterStrength = 1;
  let frameTime = 0;
  let lastLoop = Date.now();

  function frame() {
    if (!IS_PAUSED) {
      scene.render();
    }

    const thisLoop = Date.now();
    const thisFrameTime = thisLoop - lastLoop;
    frameTime += (thisFrameTime - frameTime) / filterStrength;
    lastLoop = thisLoop;

    requestAnimationFrame(frame);
  }

  setInterval(function () {
    fpsOut.innerHTML = (1000 / frameTime).toFixed(1) + ' fps';
  }, 300);

  frame();
}

window.onload = main;
