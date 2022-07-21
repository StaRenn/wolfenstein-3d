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

const CAMERA_SPEED = 1;
const FOV_DEGREES = 75;
const FOV = (FOV_DEGREES * Math.PI) / 180;
const CELL_SIZE = 10;
const TEXTURE_SIZE = 64;
const TEXTURE_SCALE = TEXTURE_SIZE / CELL_SIZE;
const CAMERA_START_POSITION = { x: CELL_SIZE * 1.5, y: CELL_SIZE * 1.5 };
const RAY_LENGTH = 5000;
const DOOR_IDS = [27, 28];
const OBSTACLES_MOVE_SPEED = CELL_SIZE / (CELL_SIZE * 4);

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
  [OBSTACLE_SIDES.TOP]: -CELL_SIZE,
  [OBSTACLE_SIDES.BOTTOM]: CELL_SIZE,
  [OBSTACLE_SIDES.LEFT]: -CELL_SIZE,
  [OBSTACLE_SIDES.RIGHT]: CELL_SIZE,
} as const;

async function main() {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;

  canvas.onclick = function () {
    canvas.requestPointerLock();
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
    scene.render();

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
