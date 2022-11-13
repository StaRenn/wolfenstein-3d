const canvas = document.getElementById('canvas') as HTMLCanvasElement;

async function main() {
  const menu = document.getElementById('menu-container') as HTMLDivElement;
  const resolutionScaleRange = document.getElementById('resolution-scale') as HTMLInputElement;
  const fovRange = document.getElementById('fov') as HTMLInputElement;
  const fovRangeValue = document.getElementById('fovValue') as HTMLInputElement;
  const continueButton = document.getElementById('continue-button') as HTMLButtonElement;

  fovRange.value = String(FOV_DEGREES);
  fovRangeValue.innerText = String(FOV_DEGREES);
  resolutionScaleRange.value = '3';

  continueButton.onclick = () => {
    if (IS_PAUSED) {
      IS_PAUSED = false;

      menu.style.display = 'none';
    }
  };

  resolutionScaleRange.oninput = (event: InputEvent) => {
    if (event.target) {
      RESOLUTION_SCALE = RESOLUTIONS_SCALE_VALUES[Number((event.target as HTMLInputElement).value)];

      handleResize();
      scene.render();
    }
  };

  fovRange.oninput = (event: InputEvent) => {
    if (event.target) {
      FOV_DEGREES = Number((event.target as HTMLInputElement).value);
      FOV = (FOV_DEGREES * Math.PI) / 180;

      fovRangeValue.innerText = (event.target as HTMLInputElement).value;

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
  let filterStrength = 20;
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
  }, 200);

  frame();
}

window.onload = main;
