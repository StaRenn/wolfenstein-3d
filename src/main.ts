import { Scene } from './models/Scene';

import {
  DEFAULT_FOV,
  DEFAULT_FOV_DEGREES,
  DEFAULT_FRAME_DURATION,
  DEFAULT_RESOLUTION_SCALE,
  RESOLUTIONS_SCALE_VALUES,
} from './constants/config';
import { map } from './constants/map';

import { toRadians } from './helpers/maths';

export const canvas = document.getElementById('canvas') as HTMLCanvasElement;

async function main() {
  const menu = document.getElementById('menu-container') as HTMLDivElement;
  const resolutionScaleRange = document.getElementById('resolution-scale') as HTMLInputElement;
  const fovRange = document.getElementById('fov') as HTMLInputElement;
  const fovRangeValue = document.getElementById('fovValue') as HTMLInputElement;
  const continueButton = document.getElementById('continue-button') as HTMLButtonElement;

  let isPaused = false;
  let resolutionScale = DEFAULT_RESOLUTION_SCALE;
  let fov = DEFAULT_FOV;

  fovRange.value = String(DEFAULT_FOV_DEGREES);
  fovRangeValue.innerText = String(DEFAULT_FOV_DEGREES);
  resolutionScaleRange.value = String(RESOLUTIONS_SCALE_VALUES.indexOf(DEFAULT_RESOLUTION_SCALE));

  const scene = new Scene(canvas, map, {
    height: window.innerHeight,
    width: window.innerWidth,
  });

  const fpsOut = document.getElementById('fps')!;
  let prevFrameDuration = 0;
  let frameDuration = 0;
  let filterStrength = 20;
  let frameTime = 0;

  function handleResize() {
    scene.resize(window.innerWidth, window.innerHeight);
  }

  function handleResolutionScaleChange(event: Event) {
    if (event.target) {
      resolutionScale = RESOLUTIONS_SCALE_VALUES[Number((event.target as HTMLInputElement).value)];

      scene.resolutionScale = resolutionScale;
    }
  }

  function handleFOVChange(event: Event) {
    if (event.target) {
      const degrees = Number((event.target as HTMLInputElement).value);
      fov = toRadians(degrees);

      fovRangeValue.innerText = (event.target as HTMLInputElement).value;

      scene.fov = fov;
    }
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      isPaused = true;

      menu.style.display = 'flex';
    }
  }

  function resume() {
    if (isPaused) {
      isPaused = false;

      menu.style.display = 'none';
    }
  }

  (function frame(currentFrameDuration: number) {
    if (!isPaused) {
      scene.iterate();
    }

    scene.render();

    prevFrameDuration = frameDuration;
    frameDuration = currentFrameDuration;

    const frameDiff = frameDuration - prevFrameDuration;

    frameTime += (frameDiff - frameTime) / filterStrength;

    TIME_SCALE = Math.min(Math.round((frameDiff / DEFAULT_FRAME_DURATION) * 100) / 100, 1);

    requestAnimationFrame(frame);
  })(0);

  setInterval(function () {
    fpsOut.innerHTML = (1000 / frameTime).toFixed(1) + ' fps';
  }, 200);

  continueButton.onclick = resume;

  resolutionScaleRange.oninput = handleResolutionScaleChange;

  fovRange.oninput = handleFOVChange;

  window.onkeydown = handleKeyDown;
  window.addEventListener('resize', handleResize);

  canvas.onclick = () => {
    canvas.requestPointerLock();
  };
}

window.onload = main;
