var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let RESOLUTION_SCALE = 0.5;
let RESOLUTIONS_SCALE_VALUES = [0.1, 0.25, 0.5, 1];
let IS_PAUSED = false;
let FOV_DEGREES = 90;
let FOV = (FOV_DEGREES * Math.PI) / 180;
const canvas = document.getElementById('canvas');
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const menu = document.getElementById('menu-container');
        const resolutionScaleRange = document.getElementById('resolution-scale');
        const fovRange = document.getElementById('fov');
        const fovRangeValue = document.getElementById('fovValue');
        const continueButton = document.getElementById('continue-button');
        fovRange.value = String(FOV_DEGREES);
        fovRangeValue.innerText = String(FOV_DEGREES);
        resolutionScaleRange.value = "2";
        continueButton.onclick = () => {
            if (IS_PAUSED) {
                IS_PAUSED = false;
                menu.style.display = 'none';
            }
        };
        resolutionScaleRange.oninput = (event) => {
            if (event.target) {
                RESOLUTION_SCALE = RESOLUTIONS_SCALE_VALUES[Number(event.target.value)];
                handleResize();
                scene.render();
            }
        };
        fovRange.oninput = (event) => {
            if (event.target) {
                FOV_DEGREES = Number(event.target.value);
                FOV = (FOV_DEGREES * Math.PI) / 180;
                fovRangeValue.innerText = event.target.value;
                handleResize();
                scene.render();
            }
        };
        canvas.onclick = () => {
            IS_PAUSED = false;
            canvas.requestPointerLock();
        };
        window.onkeydown = (event) => {
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
        const fpsOut = document.getElementById('fps');
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
    });
}
window.onload = main;
const map = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 9, 17, 15, 9, 15, 17, 13, 15, 17, 9, 17, 15, 9, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 0, 0, 0, 0, 0, 0, "35_SPRITE_HOLLOW_ITEM", 0, 0, 0, 0, 0, 0, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 0, 0, "24_SPRITE_HOLLOW", 0, 0, 0, "24_SPRITE_HOLLOW", 0, 0, 0, "24_SPRITE_HOLLOW", 0, "34_SPRITE_HOLLOW_ITEM", 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 17, 17, 15, 15, 17, 0, 0, 0, 17, 15, 15, 17, 15, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 0, 0, 0, 0, 15, 0, 0, 0, 15, 0, 0, 0, 0, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 0, "START_POS", 0, 0, 27, 0, "24_SPRITE_HOLLOW", 0, 27, "35_SPRITE_HOLLOW_ITEM", 0, 0, "26_SPRITE_HOLLOW", 17, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 0, 0, 0, 0, 15, 0, 0, 0, 15, 0, 0, 0, 0, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, "1_ID5313_END", 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 15, 17, 15, 15, 17, 0, 0, 0, 15, 15, 15, 15, 15, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 0, 0, 0, 0, 17, 0, 0, 0, 17, 0, 0, 0, 0, 17, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, "1_ID5313_START", 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 0, 0, 0, 0, 15, 0, 0, 0, 15, 0, 0, 0, 0, 17, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 31, 5, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 15, 0, 0, 0, 0, 27, 0, "24_SPRITE_HOLLOW", 0, 27, 0, "23_SPRITE_HOLLOW", 0, 0, 17, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 31, 0, 33, 0, 0, 1, 0, 0, 1, "1_ID4918_END", 3, 1, 0, 0, 0, 0, 0, 0, 17, "26_SPRITE_HOLLOW", "35_SPRITE_HOLLOW_ITEM", 0, 0, 15, 0, 0, 0, 15, 0, 0, 0, 0, 17, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 31, 5, 0, 0, 1, "1_ID5017_END", 0, "1_ID5017_START", 0, "39_SPRITE_HOLLOW_ITEM", 1, 0, 0, 0, 0, 0, 0, 15, 15, 17, 15, 17, 15, 15, 27, 15, 15, 15, 15, 15, 17, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [1, 3, 3, 1, 3, 3, 1, 3, 3, 1, 7, 1, 1, 1, 3, 1, 1, 1, "1_ID4918_START", 3, 1, 11, 1, 3, 1, 0, 0, 0, 0, 0, 0, 0, 15, 0, 0, 0, 17, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 5, 31, 1, 0, 0, 0, 0, 0, 17, 0, "24_SPRITE_HOLLOW", 0, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [3, 0, 0, 0, 0, 0, "24_SPRITE_HOLLOW", 0, 0, 0, 0, 0, 0, 0, "24_SPRITE_HOLLOW", 0, 0, 27, 0, 0, 0, 0, 0, 0, 33, 0, 31, 0, 0, 0, 0, 0, 17, 0, 0, 0, 17, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 15, 15, 15, 15, 15, 15, 15, 15, 0, 0, 0, 0], [3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 5, 31, 1, 0, 0, 0, 0, 0, 15, 0, 0, 0, 17, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 17, 15, 15, 15, 17, 0, 15, 0, 15, 0, 15, 0, 15, 17, 0, 0, 0], [1, 0, 0, 0, 3, 1, 3, 1, 3, 0, 0, 0, 1, 3, 1, 3, 3, 5, 1, 3, 1, 11, 3, 1, 3, 0, 0, 0, 0, 0, 0, 0, 17, 0, 0, 0, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 0, 0, 0, 15, 0, 0, 0, 0, 0, 0, 0, 0, "27_SPRITE_HOLLOW", 15, 0, 0, 0], [3, 0, "24_SPRITE_HOLLOW", 0, 1, 1, 3, 1, 1, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 0, "24_SPRITE_HOLLOW", 0, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 0, 0, 0, 27, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 0, 0, 0], [3, 0, 0, 0, 3, "35_SPRITE_HOLLOW_ITEM", 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 0, 0, 0, 17, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 0, 0, 0, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 0, 0, 0], [1, 0, 0, 0, 0, 0, "24_SPRITE_HOLLOW", 0, 5, 0, "24_SPRITE_HOLLOW", 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 0, 0, 0, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 0, 0, 15, 15, 17, 0, 15, 0, 17, 0, 17, 0, 15, 17, 0, 0, 0], [3, 0, 0, 0, 1, 0, 0, "1_SPRITE", 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 0, 0, 0, 17, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 0, 0, 17, 0, 15, 15, 15, 15, 15, 15, 15, 15, 15, 0, 0, 0, 0], [1, 0, 0, 0, 1, 1, 1, 1, 3, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 0, "24_SPRITE_HOLLOW", 0, 17, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 0, 0, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [1, 0, 0, 0, 3, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 0, 0, 0, 17, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 0, 0, 17, 0, 0, 0, 0, 0, 17, 17, 17, 17, 17, 17, 0, 0, 0], [7, 0, "24_SPRITE_HOLLOW", 0, 7, 1, 3, 1, 1, 3, 27, 1, 1, 3, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 15, 15, 27, 17, 15, 15, 0, 0, 0, 0, 0, 0, 0, 0, 17, 0, 0, 15, 0, 0, 0, 17, 17, 15, "17_SPRITE", 17, 15, "18_SPRITE", 17, 15, 17, 0], [1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 7, 1, 3, 1, 0, 0, 0, 0, 0, 1, 3, 7, 1, 3, 1, 0, 0, 0, 17, 0, 0, 17, 0, 0, 0, 15, 0, 0, 0, 0, 0, 0, "35_SPRITE_HOLLOW_ITEM", 0, 15, 0], [3, 0, 0, 0, 1, 1, 0, "9_SPRITE", 0, 0, 0, 0, 0, "9_SPRITE", 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, "9_SPRITE", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, "9_SPRITE", 3, 0, 0, 15, 15, 0, 0, 15, 15, 0, 0, 17, 0, 0, 0, 0, 0, 0, 0, 0, 17, 0], [1, 0, 0, 0, 1, 1, 0, 0, "24_SPRITE_HOLLOW", 0, 0, 0, "24_SPRITE_HOLLOW", 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11, 15, 15, 15, 0, 0, 0, 0, 17, 17, 15, 15, 0, 0, "11_SPRITE", "35_SPRITE_HOLLOW_ITEM", 0, "11_SPRITE", 0, 0, 15, 0], [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 0, 0, 0, 0, 0, 0, 0, 0, 17, 0], [1, 0, 0, 0, 0, 27, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, "25_SPRITE_HOLLOW", 0, 0, 0, 0, "25_SPRITE_HOLLOW", 0, 0, 0, 0, "25_SPRITE_HOLLOW", 0, 0, 0, 27, 0, 0, 0, 0, 0, 0, 0, 0, 0, 27, 0, 0, 0, 0, 0, 0, 0, 0, 9, 0], [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 0, 0, 0, 0, 0, 0, 0, 0, 17, 0], [1, 0, 0, 0, 1, 3, 0, 0, "24_SPRITE_HOLLOW", 0, 0, 0, "24_SPRITE_HOLLOW", 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11, 17, 15, 15, 15, 17, 15, 15, 15, 17, 17, 15, 0, 0, 0, 0, 0, 0, 0, 0, 15, 0], [3, 0, 0, 0, 1, 3, 0, "9_SPRITE", 0, 0, 0, 0, 0, "9_SPRITE", 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, "9_SPRITE", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, "9_SPRITE", 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 0, 0, 0, 0, 0, 0, 0, "16_SPRITE", 17, 0], [5, 0, "24_SPRITE_HOLLOW", 0, 5, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 3, 1, 5, 3, "9_SPRITE", 0, 0, 0, "9_SPRITE", 1, 5, 1, 3, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, "35_SPRITE_HOLLOW_ITEM", 0, 0, 0, "22_SPRITE_HOLLOW", "16_SPRITE", "16_SPRITE", "16_SPRITE", 15, 0], [3, 0, 0, 0, 1, 3, 1, 3, 1, 1, 27, 1, 1, 3, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 23, 19, 27, 19, 23, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 15, 17, 15, 15, 15, 17, 17, 17, 15, 0], [1, 0, 0, 0, 1, 0, 0, "38_SPRITE_HOLLOW_ITEM", 3, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 23, 0, 0, 0, 23, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [1, 0, 0, 0, 0, 0, "24_SPRITE_HOLLOW", 0, 5, 0, "24_SPRITE_HOLLOW", 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 23, 23, 23, 23, 0, 19, 0, "24_SPRITE_HOLLOW", 0, 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [1, 0, "24_SPRITE_HOLLOW", 0, 3, 0, 0, "35_SPRITE_HOLLOW_ITEM", 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 23, "40_SPRITE_HOLLOW_ITEM", "39_SPRITE_HOLLOW_ITEM", 23, 0, 23, 0, 0, 0, 23, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [1, 0, 0, 0, 1, 1, 3, 1, 1, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 23, "34_SPRITE_HOLLOW_ITEM", "39_SPRITE_HOLLOW_ITEM", 23, 0, 23, 0, 0, 0, 23, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [3, 1, 27, 1, 1, 0, 0, 0, 5, 0, "24_SPRITE_HOLLOW", 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 23, "34_SPRITE_HOLLOW_ITEM", 0, 23, 23, 23, 0, 0, 0, 23, 23, 23, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 23, "19_ID2230_END", 0, "19_ID2230_START", 0, 0, 0, "24_SPRITE_HOLLOW", 0, 0, "12_SPRITE", 23, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [1, 0, "24_SPRITE_HOLLOW", 0, 3, 1, 3, 11, 1, 1, 27, 1, 1, 11, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 23, 23, 23, 23, 23, 23, 0, 0, 0, 23, 23, 23, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [3, 0, "39_SPRITE_HOLLOW_ITEM", "16_SPRITE", 1, 1, "42_SPRITE_HOLLOW_ITEM", "42_SPRITE_HOLLOW_ITEM", 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 23, 0, 0, 0, 23, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [1, 3, 1, 3, 1, 5, "42_SPRITE_HOLLOW_ITEM", "3_SPRITE", 0, 0, 0, 0, 0, "3_SPRITE", 0, 5, 1, 3, 1, 11, 1, 3, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 23, 0, 0, 0, 23, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 21, 0, "24_SPRITE_HOLLOW", 0, 21, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 3, "19_SPRITE", 0, 0, 0, "2_SPRITE", 0, 0, 0, 0, 27, 0, 0, 0, "24_SPRITE_HOLLOW", 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 23, 0, 0, 0, 23, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 23, 0, 0, 0, 23, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 5, 0, "3_SPRITE", 0, 0, 0, "36_SPRITE_HOLLOW_ITEM", 0, "3_SPRITE", 0, 5, 1, 3, 0, 0, 0, 1, 3, 1, 0, 0, 0, 0, 23, 23, 23, 19, 23, 23, 27, 23, 23, 19, 23, 23, 23, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 3, 0, "36_SPRITE_HOLLOW_ITEM", "38_SPRITE_HOLLOW_ITEM", "7_SPRITE", 0, "7_SPRITE", "38_SPRITE_HOLLOW_ITEM", 0, 0, 3, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 23, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 23, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 1, 3, 11, 1, 3, "7_ID1310_START", 3, 1, 11, 1, 1, 0, 1, 0, 0, 0, 1, 1, 1, 5, 1, 1, 3, 21, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21, 23, 23, 23, 23, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 1, "34_SPRITE_HOLLOW_ITEM", "34_SPRITE_HOLLOW_ITEM", "42_SPRITE_HOLLOW_ITEM", 0, 0, 1, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 23, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 23, "38_SPRITE_HOLLOW_ITEM", "38_SPRITE_HOLLOW_ITEM", "38_SPRITE_HOLLOW_ITEM", 23, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 1, "34_SPRITE_HOLLOW_ITEM", "34_SPRITE_HOLLOW_ITEM", "42_SPRITE_HOLLOW_ITEM", "42_SPRITE_HOLLOW_ITEM", "7_ID1310_END", 1, 0, 0, 0, 0, 0, 1, 0, "24_SPRITE_HOLLOW", 0, 0, 0, 0, "24_SPRITE_HOLLOW", 0, 0, 0, 27, 0, 0, 0, 0, 0, "25_SPRITE_HOLLOW", 0, 0, 0, 0, 0, 27, 0, 0, "36_SPRITE_HOLLOW_ITEM", 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 1, "34_SPRITE_HOLLOW_ITEM", "34_SPRITE_HOLLOW_ITEM", "42_SPRITE_HOLLOW_ITEM", "36_SPRITE_HOLLOW_ITEM", 1, 1, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 23, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 23, "36_SPRITE_HOLLOW_ITEM", "36_SPRITE_HOLLOW_ITEM", "38_SPRITE_HOLLOW_ITEM", 23, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 1, "34_SPRITE_HOLLOW_ITEM", "34_SPRITE_HOLLOW_ITEM", "36_SPRITE_HOLLOW_ITEM", "36_SPRITE_HOLLOW_ITEM", 1, 0, 0, 0, 0, 0, 0, 1, 1, 3, 3, 1, 3, 3, 5, 1, 3, 1, 19, 0, 0, "2_SPRITE", 0, 0, "2_SPRITE", 0, 0, "2_SPRITE", 0, 0, 19, 23, 23, 23, 23, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 23, "10_SPRITE", 0, 0, 0, 0, 0, 0, 0, 0, 0, "10_SPRITE", 23, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 23, 23, 23, 19, 23, 23, 23, 23, 23, 19, 23, 23, 23, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];
const TILE_SIZE = 10;
const RAY_LENGTH = TILE_SIZE * 35;
const ACTOR_SPEED = 1;
const DOOR_IDS = [27, 28, 33, 34];
const STATIC_DOORS_IDS = [33];
const OBSTACLES_MOVE_SPEED = TILE_SIZE / (TILE_SIZE * 4);
const TEXTURE_SIZE = 64;
const TEXTURE_SCALE = TEXTURE_SIZE / TILE_SIZE;
const HUD_WIDTH_COEFFICIENT = 0.75;
const ITEMS_PURPOSES = {
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
        value: "MACHINE_GUN",
    }
};
const INTERSECTION_TYPES = {
    VERTICAL: 'VERTICAL',
    HORIZONTAL: 'HORIZONTAL',
};
const OBSTACLE_SIDES = {
    TOP: 'TOP',
    BOTTOM: 'BOTTOM',
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
};
const NEIGHBOR_OFFSET = {
    [OBSTACLE_SIDES.TOP]: -TILE_SIZE,
    [OBSTACLE_SIDES.BOTTOM]: TILE_SIZE,
    [OBSTACLE_SIDES.LEFT]: -TILE_SIZE,
    [OBSTACLE_SIDES.RIGHT]: TILE_SIZE,
};
const WEAPONS = {
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
const HUD_PANEL = {
    TEXTURE: getImageWithSource(`src/assets/hud/panel.png`),
    WIDTH: 400,
    HEIGHT: 40,
    INFO_Y_OFFSET: 16,
    WEAPON_Y_OFFSET: 8,
    LEVEL_X_OFFSET: 65,
    SCORE_X_OFFSET: 111,
    LIVES_X_OFFSET: 156,
    HEALTH_X_OFFSET: 219,
    AMMO_X_OFFSET: 262,
    WEAPON_X_OFFSET: 296,
    PORTRAIT_X_OFFSET: 174,
    PORTRAIT_Y_OFFSET: 5,
};
const FONT_IMAGE = getImageWithSource('src/assets/hud/font.png');
const FONT_SYMBOL_WIDTH = 8;
const FONT_SYMBOL_HEIGHT = 16;
const WEAPON_ICON_WIDTH = 48;
const WEAPON_ICON_HEIGHT = 24;
const PORTRAIT_WIDTH = 30;
const PORTRAIT_HEIGHT = 31;
const ACTOR_PORTRAIT_FRAME_SETS = {
    HEALTHY: fillPortraitFrameSet('HEALTHY'),
    JUST_A_SCRATCH: fillPortraitFrameSet('JUST_A_SCRATCH'),
    MINOR_DAMAGE: fillPortraitFrameSet('MINOR_DAMAGE'),
    MODERATE_DAMAGE: fillPortraitFrameSet('MODERATE_DAMAGE'),
    SEVERE_DAMAGE: fillPortraitFrameSet('SEVERE_DAMAGE'),
    SUFFERING: fillPortraitFrameSet('SUFFERING'),
    NEAR_DEATH: fillPortraitFrameSet('NEAR_DEATH'),
    DEAD: [
        {
            data: getImageWithSource('src/assets/hud/portrait/dead/frame_0.png'),
            duration: 10000,
        },
    ],
};
function fillWeaponFrameSet(weaponType, duration) {
    const frameSet = [];
    for (let i = 0; i < 5; i++) {
        frameSet.push(getImageWithSource(`src/assets/weapons/${weaponType.toLowerCase()}/${weaponType.toLowerCase()}_frame_${i}.png`));
    }
    return frameSet.map((frame) => ({
        data: frame,
        duration,
    }));
}
function fillPortraitFrameSet(condition) {
    const frameSet = [];
    for (let i = 0; i < 3; i++) {
        frameSet.push(getImageWithSource(`src/assets/hud/portrait/${condition.toLowerCase()}/frame_${i}.png`));
    }
    return [
        {
            data: frameSet[0],
            duration: 2000,
        },
        {
            data: frameSet[1],
            duration: 750,
        },
        {
            data: frameSet[2],
            duration: 750,
        },
        {
            data: frameSet[1],
            duration: 750,
        },
        {
            data: frameSet[0],
            duration: 1500,
        },
        {
            data: frameSet[1],
            duration: 1500,
        },
        {
            data: frameSet[2],
            duration: 200,
        },
        {
            data: frameSet[1],
            duration: 500,
        },
        {
            data: frameSet[2],
            duration: 500,
        },
        {
            data: frameSet[1],
            duration: 500,
        },
    ];
}
function generatePostEffectFrameSet(color) {
    return [
        {
            data: { color: `rgba(${color.join(',')}, 0)` },
            duration: 10000,
        },
        {
            data: { color: `rgba(${color.join(',')}, 0.25)` },
            duration: 40,
        },
        {
            data: { color: `rgba(${color.join(',')}, 0.2)` },
            duration: 40,
        },
        {
            data: { color: `rgba(${color.join(',')}, 0.15)` },
            duration: 40,
        },
        {
            data: { color: `rgba(${color.join(',')}, 0.1)` },
            duration: 40,
        },
        {
            data: { color: `rgba(${color.join(',')}, 0.05)` },
            duration: 40,
        },
    ];
}
function getImageWithSource(path) {
    const image = new Image();
    image.src = path;
    return image;
}
class Actor {
    constructor(ctx, obstacles, obstaclesVectorsByPurposes, screenData, initialPosition) {
        this.ammo = 50;
        this.score = 0;
        this.ctx = ctx;
        this.currentWeapon = 'PISTOL';
        this.currentlyMovingObstacles = [];
        this.health = 100;
        this.horizontalSpeed = 0;
        this.lives = 3;
        this.level = 1;
        this.obstacles = obstacles;
        this.obstaclesVectorsByPurposes = obstaclesVectorsByPurposes;
        this.position = initialPosition;
        this.screenData = screenData;
        this.verticalSpeed = 0;
        this.weapons = ['KNIFE', 'PISTOL'];
        this.isShooting = false;
        this.renderWeapon = this.renderWeapon.bind(this);
        this.camera = new Camera(this.position, this.screenData.screenWidth * RESOLUTION_SCALE, this.ctx, this.obstaclesVectorsByPurposes.walls, this.obstaclesVectorsByPurposes.sprites);
        this.hud = new Hud(this.ctx, this.screenData);
        this.timeout = new Timeout();
        this.shoot = this.shoot.bind(this);
        this.renderWeapon = this.renderWeapon.bind(this);
        this.renderPostEffect = this.renderPostEffect.bind(this);
        this.weaponAnimationController = new AnimationController({
            renderFunction: this.renderWeapon,
            initialFrameIdx: 0,
            isLoopAnimation: false,
            frameSet: WEAPONS[this.currentWeapon].frameSet,
            onFrameChange: this.shoot,
        });
        this.postEffectAnimationController = new AnimationController({
            renderFunction: this.renderPostEffect,
            initialFrameIdx: 0,
            isLoopAnimation: false,
            frameSet: generatePostEffectFrameSet([255, 255, 0]),
        });
        window.addEventListener('mousedown', this.handleMouseEvent.bind(this));
        window.addEventListener('mouseup', this.handleMouseEvent.bind(this));
        window.addEventListener('keydown', this.handleKeyDown.bind(this));
        window.addEventListener('keyup', this.handleKeyUp.bind(this));
    }
    get canShoot() {
        return this.timeout.isExpired && (this.ammo > 0 || WEAPONS[this.currentWeapon].ammoPerAttack === 0);
    }
    updateObstaclesVectorsByPurposes(obstacleVectorsByPurposes) {
        this.obstaclesVectorsByPurposes = obstacleVectorsByPurposes;
        this.camera.updateObstacles(obstacleVectorsByPurposes.walls, obstacleVectorsByPurposes.sprites);
    }
    updateObstacles(obstacles) {
        this.obstacles = obstacles;
    }
    handleKeyDown(event) {
        if (event.key === '1') {
            this.changeWeapon('KNIFE');
        }
        else if (event.key === '2') {
            this.changeWeapon('PISTOL');
        }
        else if (event.key === '3') {
            this.changeWeapon('MACHINE_GUN');
        }
        if (event.keyCode === 87) {
            this.verticalSpeed = ACTOR_SPEED;
        }
        else if (event.keyCode === 83) {
            this.verticalSpeed = -ACTOR_SPEED;
        }
        else if (event.keyCode === 68) {
            this.horizontalSpeed = ACTOR_SPEED;
        }
        else if (event.keyCode === 65) {
            this.horizontalSpeed = -ACTOR_SPEED;
        }
    }
    handleMouseEvent(event) {
        if (event.buttons === 1) {
            this.isShooting = true;
        }
        if (event.buttons === 0) {
            this.isShooting = false;
        }
    }
    handleKeyUp(event) {
        if (event.keyCode === 87 && this.verticalSpeed > 0) {
            this.verticalSpeed = 0;
        }
        else if (event.keyCode === 83 && this.verticalSpeed < 0) {
            this.verticalSpeed = 0;
        }
        else if (event.keyCode === 68 && this.horizontalSpeed > 0) {
            this.horizontalSpeed = 0;
        }
        else if (event.keyCode === 65 && this.horizontalSpeed < 0) {
            this.horizontalSpeed = 0;
        }
    }
    renderWeapon(texture) {
        const hudHeight = ((this.screenData.screenWidth * HUD_WIDTH_COEFFICIENT) / HUD_PANEL.WIDTH) * HUD_PANEL.HEIGHT;
        const weaponSize = this.screenData.screenHeight - hudHeight;
        const xOffset = this.screenData.screenWidth / 2 - weaponSize / 2;
        const yOffset = this.screenData.screenHeight - weaponSize - hudHeight;
        this.ctx.drawImage(texture, 0, 0, TEXTURE_SIZE, TEXTURE_SIZE, xOffset, yOffset, weaponSize, weaponSize);
    }
    renderPostEffect(data) {
        this.ctx.fillStyle = data.color;
        this.ctx.fillRect(0, 0, this.screenData.screenWidth, this.screenData.screenHeight);
    }
    changeWeapon(weaponType) {
        if (this.weapons.includes(weaponType)) {
            this.currentWeapon = weaponType;
            this.weaponAnimationController.updateFrameSet(WEAPONS[this.currentWeapon].frameSet);
            this.timeout.set(100);
        }
    }
    playShootAnimation() {
        if (this.canShoot) {
            const weapon = WEAPONS[this.currentWeapon];
            this.weaponAnimationController.playAnimation();
            this.timeout.set(weapon.frameDuration * weapon.frameSet.length - 1);
        }
    }
    shoot(frameIdx) {
        if (frameIdx === WEAPONS[this.currentWeapon].shootFrameIdx) {
            this.ammo -= WEAPONS[this.currentWeapon].ammoPerAttack;
        }
    }
    move() {
        if (this.horizontalSpeed === 0 && this.verticalSpeed === 0) {
            return;
        }
        const position = { x: this.position.x, y: this.position.y };
        const verticalChangeX = Math.sin(this.camera.angle) * this.verticalSpeed;
        const verticalChangeY = Math.cos(this.camera.angle) * this.verticalSpeed;
        const horizontalChangeX = Math.sin(this.camera.angle + Math.PI / 2) * this.horizontalSpeed;
        const horizontalChangeY = Math.cos(this.camera.angle + Math.PI / 2) * this.horizontalSpeed;
        const xSum = verticalChangeX + horizontalChangeX;
        const ySum = verticalChangeY + horizontalChangeY;
        position.x += xSum >= 0 ? Math.min(xSum, ACTOR_SPEED) : Math.max(xSum, -ACTOR_SPEED);
        position.y += ySum >= 0 ? Math.min(ySum, ACTOR_SPEED) : Math.max(ySum, -ACTOR_SPEED);
        const checkCollision = (planes, shouldFixCollision) => {
            for (let plane of planes) {
                const obstacle = this.obstacles[Number(plane.obstacleIdx)];
                if (!obstacle.doesExist) {
                    continue;
                }
                let doesCollide = false;
                if (this.position.y >= plane.position.y1 &&
                    this.position.y <= plane.position.y2 &&
                    ((position.x >= plane.position.x1 && this.position.x <= plane.position.x1) ||
                        (position.x <= plane.position.x1 && this.position.x >= plane.position.x1))) {
                    if (shouldFixCollision) {
                        position.x = this.position.x;
                    }
                    doesCollide = true;
                }
                if (this.position.x >= plane.position.x1 &&
                    this.position.x <= plane.position.x2 &&
                    ((position.y >= plane.position.y1 && this.position.y <= plane.position.y1) ||
                        (position.y <= plane.position.y1 && this.position.y >= plane.position.y1))) {
                    if (shouldFixCollision) {
                        position.y = this.position.y;
                    }
                    doesCollide = true;
                }
                if (position.x >= obstacle.position.x1 &&
                    position.x <= obstacle.position.x2 &&
                    position.y >= obstacle.position.y1 &&
                    position.y <= obstacle.position.y2) {
                    if (shouldFixCollision) {
                        position.y = this.position.y;
                        position.x = this.position.x;
                    }
                    doesCollide = true;
                }
                if (doesCollide && isItemObstacle(obstacle)) {
                    const purpose = obstacle.purpose;
                    if (isDesiredPurpose(purpose, 'ammo')) {
                        if (this.ammo === 100) {
                            continue;
                        }
                        this.ammo += purpose.value;
                        if (this.ammo > 100) {
                            this.ammo = 100;
                        }
                    }
                    if (isDesiredPurpose(purpose, 'health')) {
                        if (this.health === 100) {
                            continue;
                        }
                        this.health += purpose.value;
                        if (this.health > 100) {
                            this.health = 100;
                        }
                    }
                    if (isDesiredPurpose(purpose, 'score')) {
                        this.score += purpose.value;
                    }
                    if (isDesiredPurpose(purpose, 'weapons')) {
                        this.weapons.push(purpose.value);
                    }
                    if (isDesiredPurpose(purpose, 'lives')) {
                        this.lives += purpose.value;
                    }
                    this.postEffectAnimationController.updateFrameSet(generatePostEffectFrameSet([255, 255, 0]));
                    this.postEffectAnimationController.playAnimation();
                    this.obstacles[Number(plane.obstacleIdx)].doesExist = false;
                }
            }
        };
        checkCollision(this.obstaclesVectorsByPurposes.collisionObstacles, true);
        checkCollision(this.obstaclesVectorsByPurposes.items, false);
        this.position = position;
        this.camera.updatePosition(this.position);
    }
    render() {
        this.timeout.iterate();
        this.weaponAnimationController.iterate();
        if (this.isShooting && !this.weaponAnimationController.getIsCurrentlyInTimeout()) {
            this.playShootAnimation();
        }
        this.hud.render({
            currentWeapon: this.currentWeapon,
            ammo: this.ammo,
            lives: this.lives,
            score: this.score,
            level: this.level,
            health: this.health,
        });
        this.postEffectAnimationController.iterate();
        this.move();
    }
}
class AnimationController {
    constructor({ frameSet, renderFunction, initialFrameIdx, isLoopAnimation, onAnimationEnd = () => { }, onAnimationStart = () => { }, onFrameChange = () => { }, }) {
        this.frameSet = frameSet;
        this.currentFrameIdx = initialFrameIdx;
        this.derivedRenderFunction = renderFunction;
        this.isLoopAnimation = isLoopAnimation;
        this.onAnimationEnd = onAnimationEnd;
        this.onAnimationStart = onAnimationStart;
        this.onFrameChange = onFrameChange;
        this.playAnimation = this.playAnimation.bind(this);
        this.timeout = new Timeout(this.playAnimation);
        if (isLoopAnimation) {
            this.timeout.set(this.getCurrentFrame().duration);
        }
    }
    updateFrameSet(frameSet) {
        this.frameSet = frameSet;
        this.currentFrameIdx = 0;
        this.timeout.reset();
        if (this.isLoopAnimation) {
            this.timeout.set(this.getCurrentFrame().duration);
        }
    }
    getCurrentFrame() {
        return this.frameSet[this.currentFrameIdx];
    }
    getIsCurrentlyInTimeout() {
        return !this.timeout.isExpired;
    }
    playAnimation() {
        if (this.currentFrameIdx === this.frameSet.length - 1) {
            this.timeout.reset();
            this.currentFrameIdx = 0;
            this.onAnimationEnd();
            if (this.isLoopAnimation) {
                this.timeout.set(this.getCurrentFrame().duration);
            }
        }
        else {
            if (this.currentFrameIdx === 0) {
                this.onAnimationStart();
            }
            this.currentFrameIdx += 1;
            this.timeout.set(this.getCurrentFrame().duration);
        }
        this.onFrameChange(this.currentFrameIdx);
    }
    iterate() {
        this.timeout.iterate();
        this.derivedRenderFunction(this.frameSet[this.currentFrameIdx].data);
    }
}
class Camera {
    constructor(position, raysAmount, ctx, walls, sprites) {
        this.angle = this.toRadians(60);
        this.ctx = ctx;
        this.walls = walls;
        this.sprites = sprites;
        this.position = position;
        canvas.addEventListener('mousemove', this.rotate.bind(this));
        this.changeRaysAmount(raysAmount);
    }
    updatePosition(position) {
        for (let i = 0; i < this.rays.length; i++) {
            this.rays[i].move(position);
        }
        this.position = position;
    }
    updateObstacles(walls, sprites) {
        this.walls = walls;
        this.sprites = sprites;
    }
    toRadians(angle) {
        return (angle * Math.PI) / 180;
    }
    hasEqualPosition(firstPosition, secondPosition) {
        return (firstPosition.x1 === secondPosition.x1 &&
            firstPosition.y1 === secondPosition.y1 &&
            firstPosition.x2 === secondPosition.x2 &&
            firstPosition.y2 === secondPosition.y2);
    }
    getVertexByPositionAndAngle(position, angle) {
        return {
            x: position.x + RAY_LENGTH * Math.sin(angle),
            y: position.y + RAY_LENGTH * Math.cos(angle),
        };
    }
    getViewAngleIntersection(position) {
        const currentAngleRayEndVertex = this.getVertexByPositionAndAngle(this.position, this.angle);
        return Ray.getIntersectionVertexWithPlane({
            x1: this.position.x,
            y1: this.position.y,
            x2: currentAngleRayEndVertex.x,
            y2: currentAngleRayEndVertex.y,
        }, position);
    }
    getIntersections() {
        let wallsIntersections = [];
        let spritesIntersections = [];
        for (let i = 0; i < this.rays.length; i++) {
            const wallsIntersection = this.rays[i].cast(this.walls);
            if (wallsIntersection) {
                wallsIntersections.push(Object.assign(Object.assign({}, wallsIntersection), { index: i }));
            }
            const spritesIntersectionsWithCurrentRay = this.sprites
                .map((sprite) => this.rays[i].cast([sprite]))
                .filter((intersection) => intersection !== null);
            if (spritesIntersectionsWithCurrentRay.length > 0) {
                spritesIntersectionsWithCurrentRay.forEach((intersection) => {
                    spritesIntersections.push(Object.assign(Object.assign({}, intersection), { index: i }));
                });
            }
        }
        return {
            walls: wallsIntersections,
            sprites: spritesIntersections,
        };
    }
    changeRaysAmount(raysAmount) {
        this.rays = [];
        const trueRaysAmount = Math.floor(raysAmount * RESOLUTION_SCALE);
        const screenHalfLength = Math.tan(FOV / 2);
        const segmentLength = screenHalfLength / (trueRaysAmount / 2);
        for (let i = 0; i < trueRaysAmount; i++) {
            this.rays.push(new Ray(this.position, this.angle + Math.atan(segmentLength * i - screenHalfLength), this.angle));
        }
    }
    rotate(event) {
        this.angle += this.toRadians(event.movementX / 3);
        this.angle = this.angle % (2 * Math.PI);
        const screenHalfLength = Math.tan(FOV / 2);
        const segmentLength = screenHalfLength / ((Math.floor(this.rays.length / 10) * 10) / 2);
        for (let i = 0; i < this.rays.length; i++) {
            this.rays[i].changeAngle(this.angle + Math.atan(segmentLength * i - screenHalfLength), this.angle);
        }
    }
}
class Hud {
    constructor(ctx, screenData) {
        this.ctx = ctx;
        this.screenData = screenData;
        this.currentFrameSet = ACTOR_PORTRAIT_FRAME_SETS.HEALTHY;
        this.renderPortrait = this.renderPortrait.bind(this);
        this.portraitAnimation = new AnimationController({
            renderFunction: this.renderPortrait,
            frameSet: this.currentFrameSet,
            initialFrameIdx: 0,
            isLoopAnimation: true,
        });
    }
    getHealthFrameSet(health) {
        if (health > 85) {
            return ACTOR_PORTRAIT_FRAME_SETS.HEALTHY;
        }
        else if (health > 75) {
            return ACTOR_PORTRAIT_FRAME_SETS.JUST_A_SCRATCH;
        }
        else if (health > 50) {
            return ACTOR_PORTRAIT_FRAME_SETS.MINOR_DAMAGE;
        }
        else if (health > 35) {
            return ACTOR_PORTRAIT_FRAME_SETS.MODERATE_DAMAGE;
        }
        else if (health > 20) {
            return ACTOR_PORTRAIT_FRAME_SETS.SEVERE_DAMAGE;
        }
        else if (health > 5) {
            return ACTOR_PORTRAIT_FRAME_SETS.SUFFERING;
        }
        else if (health > 0) {
            return ACTOR_PORTRAIT_FRAME_SETS.NEAR_DEATH;
        }
        else {
            return ACTOR_PORTRAIT_FRAME_SETS.DEAD;
        }
    }
    renderPortrait(image) {
        const textureXPositionOnScreen = this.offsetX + Math.round(HUD_PANEL.PORTRAIT_X_OFFSET * this.scale);
        const textureYPositionOnScreen = this.offsetY + Math.round(HUD_PANEL.PORTRAIT_Y_OFFSET * this.scale);
        this.ctx.drawImage(image, 0, 0, PORTRAIT_WIDTH, PORTRAIT_HEIGHT, textureXPositionOnScreen, textureYPositionOnScreen, Math.round(PORTRAIT_WIDTH * this.scale), Math.round(PORTRAIT_HEIGHT * this.scale));
    }
    renderText(value, segmentXOffset) {
        const stringValue = String(value);
        const valueWidth = Math.ceil(stringValue.length * FONT_SYMBOL_WIDTH * this.scale);
        for (let i = 0; i < stringValue.length; i++) {
            const number = Number(stringValue[i]);
            const textureOffset = number * FONT_SYMBOL_WIDTH;
            const numberOffset = i * FONT_SYMBOL_WIDTH;
            const textureXPositionOnScreen = this.offsetX + segmentXOffset + Math.ceil(numberOffset * this.scale) - valueWidth / 2;
            const textureYPositionOnScreen = this.offsetY + Math.ceil(HUD_PANEL.INFO_Y_OFFSET * this.scale);
            this.ctx.drawImage(FONT_IMAGE, textureOffset, 0, FONT_SYMBOL_WIDTH, FONT_SYMBOL_HEIGHT, textureXPositionOnScreen, textureYPositionOnScreen, Math.ceil(FONT_SYMBOL_WIDTH * this.scale), Math.ceil(FONT_SYMBOL_HEIGHT * this.scale));
        }
    }
    render({ ammo, lives, score, health, currentWeapon, level, }) {
        const updatedHealthFrameSet = this.getHealthFrameSet(health);
        if (updatedHealthFrameSet !== this.currentFrameSet) {
            this.currentFrameSet = updatedHealthFrameSet;
            this.portraitAnimation.updateFrameSet(this.currentFrameSet);
        }
        this.scale = (this.screenData.screenWidth * HUD_WIDTH_COEFFICIENT) / HUD_PANEL.WIDTH;
        this.width = Math.round(this.screenData.screenWidth * HUD_WIDTH_COEFFICIENT);
        this.height = Math.round(HUD_PANEL.HEIGHT * this.scale);
        this.offsetX = this.screenData.screenWidth / 2 - this.width / 2;
        this.offsetY = this.screenData.screenHeight - this.height;
        this.ctx.drawImage(HUD_PANEL.TEXTURE, 0, 0, HUD_PANEL.WIDTH, HUD_PANEL.HEIGHT, this.offsetX, this.offsetY, this.width, this.height);
        this.ctx.drawImage(WEAPONS[currentWeapon].icon, 0, 0, WEAPON_ICON_WIDTH, WEAPON_ICON_HEIGHT, this.offsetX + Math.round(HUD_PANEL.WEAPON_X_OFFSET * this.scale), this.offsetY + Math.round(HUD_PANEL.WEAPON_Y_OFFSET * this.scale), Math.round(WEAPON_ICON_WIDTH * this.scale), Math.round(WEAPON_ICON_HEIGHT * this.scale));
        this.renderText(level, HUD_PANEL.LEVEL_X_OFFSET * this.scale);
        this.renderText(score, HUD_PANEL.SCORE_X_OFFSET * this.scale);
        this.renderText(lives, HUD_PANEL.LIVES_X_OFFSET * this.scale);
        this.renderText(health, HUD_PANEL.HEALTH_X_OFFSET * this.scale);
        this.renderText(ammo, HUD_PANEL.AMMO_X_OFFSET * this.scale);
        this.portraitAnimation.iterate();
    }
}
class Minimap {
    constructor(ctx, obstacles, rowsLength, columnsLength) {
        this.ctx = ctx;
        this.obstacles = obstacles;
        this.rowsLength = rowsLength;
        this.columnsLength = columnsLength;
    }
    render(position, intersections) {
        this.ctx.strokeStyle = 'orange';
        this.ctx.beginPath();
        const width = this.columnsLength * TILE_SIZE;
        const height = this.rowsLength * TILE_SIZE;
        for (let i = 0; i < intersections.length; i++) {
            const intersection = intersections[i];
            this.ctx.moveTo(position.x, height - position.y);
            this.ctx.lineTo(intersection.x, height - intersection.y);
        }
        this.ctx.closePath();
        this.ctx.stroke();
        this.ctx.fillStyle = 'white';
        for (let obstacle of this.obstacles) {
            if (!obstacle.isDoor && !obstacle.isSprite) {
                this.ctx.fillRect(obstacle.position.x1, height - obstacle.position.y1 - TILE_SIZE, TILE_SIZE, TILE_SIZE);
            }
        }
    }
}
class Ray {
    constructor(position, angle, cameraAngle) {
        this.rayAngle = angle;
        this.cameraAngle = cameraAngle;
        this.cameraPosition = {
            x1: position.x,
            y1: position.y,
            x2: position.x + Math.sin(angle) * RAY_LENGTH,
            y2: position.y + Math.cos(angle) * RAY_LENGTH,
        };
    }
    changeAngle(angle, cameraAngle) {
        this.cameraAngle = cameraAngle;
        this.rayAngle = angle;
        this.move({ x: this.cameraPosition.x1, y: this.cameraPosition.y1 });
    }
    fixFishEye(distance) {
        return distance * Math.cos(this.rayAngle - this.cameraAngle);
    }
    static getIntersectionVertexWithPlane(firstVector, secondVector) {
        const { x1, x2, y1, y2 } = firstVector;
        const { x1: x3, y1: y3, x2: x4, y2: y4 } = secondVector;
        if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
            return;
        }
        const denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
        if (denominator === 0) {
            return;
        }
        let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
        let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;
        if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
            return;
        }
        let x = x1 + ua * (x2 - x1);
        let y = y1 + ua * (y2 - y1);
        return { x, y };
    }
    getDistance(vertex) {
        return Math.sqrt((vertex.x - this.cameraPosition.x1) ** 2 + (vertex.y - this.cameraPosition.y1) ** 2);
    }
    move(position) {
        this.cameraPosition = {
            x1: position.x,
            y1: position.y,
            x2: position.x + Math.sin(this.rayAngle) * RAY_LENGTH,
            y2: position.y + Math.cos(this.rayAngle) * RAY_LENGTH,
        };
    }
    cast(planes) {
        let intersections = [];
        for (let plane of planes) {
            const intersection = Ray.getIntersectionVertexWithPlane(this.cameraPosition, plane.position);
            if (intersection) {
                intersections.push({
                    vertex: intersection,
                    plane,
                });
            }
        }
        if (intersections.length > 0) {
            let closestIntersection = intersections[0];
            const closestDistance = intersections.reduce((acc, intersection) => {
                const currentDistance = this.getDistance(intersection.vertex);
                if (acc > currentDistance) {
                    closestIntersection = intersection;
                    return currentDistance;
                }
                return acc;
            }, Infinity);
            return {
                x: closestIntersection.vertex.x,
                y: closestIntersection.vertex.y,
                plane: closestIntersection.plane,
                distance: this.fixFishEye(closestDistance),
            };
        }
        return null;
    }
}
class Scene {
    constructor(canvas, map) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.map = map;
        this.currentlyMovingObstacles = [];
        this.screenData = {
            screenHeight: this.canvas.height,
            screenWidth: this.canvas.width,
        };
        const { obstacles, startPosition } = this.parseMap(map);
        this.obstacles = obstacles;
        this.minimap = new Minimap(this.ctx, this.obstacles, this.map.length, this.map[0].length);
        this.textures = [];
        this.sprites = [];
        for (let i = 1; i < 35; i++) {
            this.textures.push(getImageWithSource(`src/assets/textures/${i}.png`));
        }
        for (let i = 1; i <= 21; i++) {
            this.sprites.push(getImageWithSource(`src/assets/sprites/static/${i}.png`));
        }
        for (let i = 22; i <= 33; i++) {
            this.sprites.push(getImageWithSource(`src/assets/sprites/hollow/${i}.png`));
        }
        for (let i = 34; i <= 42; i++) {
            this.sprites.push(getImageWithSource(`src/assets/sprites/items/${i}.png`));
        }
        this.actor = new Actor(this.ctx, this.obstacles, { walls: [], sprites: [], items: [], collisionObstacles: [] }, this.screenData, startPosition);
        this.camera = this.actor.camera;
        window.addEventListener('keypress', this.handleKeyPress.bind(this));
    }
    render() {
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.beginPath();
        this.ctx.clearRect(0, 0, this.screenData.screenWidth, this.screenData.screenHeight);
        this.ctx.closePath();
        this.ctx.fillStyle = '#383838';
        this.ctx.fillRect(0, 0, 1920, Math.ceil(this.screenData.screenHeight / 2));
        const planes = this.getPlanes();
        if (!IS_PAUSED) {
            this.moveObstacles();
            this.obstacles.forEach((obstacle) => {
                if (obstacle.closeTimeout) {
                    obstacle.closeTimeout.iterate();
                }
            });
        }
        this.actor.updateObstacles(this.obstacles);
        this.actor.updateObstaclesVectorsByPurposes(planes);
        const intersections = this.camera.getIntersections();
        const sortedAndMergedIntersections = [...intersections.walls, ...intersections.sprites].sort((a, b) => b.distance - a.distance);
        for (let i = 0; i < sortedAndMergedIntersections.length; i++) {
            const intersection = sortedAndMergedIntersections[i];
            const plane = intersection.plane;
            const index = intersection.index;
            const isHorizontalIntersection = plane.type === INTERSECTION_TYPES.HORIZONTAL;
            const textureOffsetX = this.getTextureOffset(intersection);
            const textureHeight = ((TILE_SIZE / intersection.distance) * (180 / FOV_DEGREES) * this.screenData.screenHeight) / 1.75;
            const texture = plane.isSprite
                ? this.sprites[plane.textureId - 1]
                : this.textures[plane.textureId - (isHorizontalIntersection ? 0 : 1)];
            const textureOffsetY = 0;
            const textureWidth = 1;
            const textureSize = TEXTURE_SIZE;
            const textureXPositionOnScreen = index / RESOLUTION_SCALE;
            const textureYPositionOnScreen = this.screenData.screenHeight / 2 - textureHeight / 2;
            const textureWidthOnScreen = 1 / RESOLUTION_SCALE;
            if (intersection.distance !== RAY_LENGTH) {
                this.ctx.drawImage(texture, textureOffsetX, textureOffsetY, textureWidth, textureSize, textureXPositionOnScreen, textureYPositionOnScreen, textureWidthOnScreen, textureHeight);
            }
        }
        if (!IS_PAUSED) {
            this.actor.render();
        }
        this.minimap.render(this.actor.position, intersections.walls);
    }
    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.screenData.screenHeight = height;
        this.screenData.screenWidth = width;
        this.camera.changeRaysAmount(this.canvas.width);
    }
    getTextureOffset(intersection) {
        const plane = intersection.plane;
        const position = plane.position;
        const isVerticalIntersection = plane.type === INTERSECTION_TYPES.VERTICAL;
        let isInverse = false;
        if (plane.isSprite) {
            if (Math.abs(position.x1 - position.x2) > Math.abs(position.y1 - position.y2)) {
                isInverse = true;
            }
        }
        const coordinatesToCompareWith = plane.shouldReverseTexture
            ? { x: position.x2, y: position.y2 }
            : { x: position.x1, y: position.y1 };
        const fromPlaneStartToIntersectionWidth = isVerticalIntersection || isInverse
            ? coordinatesToCompareWith.x - intersection.x
            : coordinatesToCompareWith.y - intersection.y;
        const planeLength = isVerticalIntersection || isInverse ? Math.abs(position.x1 - position.x2) : Math.abs(position.y1 - position.y2);
        const textureDistanceFromStartCoefficient = Math.abs(fromPlaneStartToIntersectionWidth) / planeLength;
        return Math.floor(textureDistanceFromStartCoefficient * TEXTURE_SIZE);
    }
    getAreaSize(x1, y1, x2, y2, x3, y3) {
        return Math.abs((x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)) / 2.0);
    }
    getVertexByPositionAndAngle(position, angle) {
        return {
            x: position.x + RAY_LENGTH * Math.sin(angle),
            y: position.y + RAY_LENGTH * Math.cos(angle),
        };
    }
    getIsVertexInTheTriangle({ x, y }, { x1, y1, x2, y2, x3, y3 }) {
        const abcArea = this.getAreaSize(x1, y1, x2, y2, x3, y3);
        const pbcArea = this.getAreaSize(x, y, x2, y2, x3, y3);
        const pacArea = this.getAreaSize(x1, y1, x, y, x3, y3);
        const pabArea = this.getAreaSize(x1, y1, x2, y2, x, y);
        return Math.round(abcArea) == Math.round(pbcArea + pacArea + pabArea);
    }
    getWallVectorFromObstacle(obstacle, planePosition) {
        const obstaclePos = obstacle.position;
        const isDoor = obstacle.isDoor;
        return {
            x1: obstaclePos.x1 + (planePosition === OBSTACLE_SIDES.RIGHT && !isDoor ? TILE_SIZE : 0),
            y1: obstaclePos.y1 + (planePosition === OBSTACLE_SIDES.BOTTOM && !isDoor ? TILE_SIZE : 0),
            x2: obstaclePos.x2 - (planePosition === OBSTACLE_SIDES.LEFT && !isDoor ? TILE_SIZE : 0),
            y2: obstaclePos.y2 - (planePosition === OBSTACLE_SIDES.TOP && !isDoor ? TILE_SIZE : 0),
        };
    }
    getSpriteFromObstacle(obstacle, index) {
        const coordinates = {
            x1: obstacle.position.x1,
            y1: obstacle.position.y1,
            x2: obstacle.position.x2,
            y2: obstacle.position.y2,
        };
        const middleVertex = {
            x: (coordinates.x2 + coordinates.x1) / 2,
            y: (coordinates.y2 + coordinates.y1) / 2,
        };
        let spriteAngle = -this.camera.angle;
        coordinates.x1 = middleVertex.x + (TILE_SIZE / 2) * Math.cos(spriteAngle);
        coordinates.y1 = middleVertex.y + (TILE_SIZE / 2) * Math.sin(spriteAngle);
        coordinates.x2 = middleVertex.x - (TILE_SIZE / 2) * Math.cos(spriteAngle);
        coordinates.y2 = middleVertex.y - (TILE_SIZE / 2) * Math.sin(spriteAngle);
        return {
            position: coordinates,
            type: INTERSECTION_TYPES.HORIZONTAL,
            shouldReverseTexture: true,
            textureId: obstacle.textureId,
            obstacleIdx: index,
            isMovable: false,
            isSprite: true,
            isVisible: true,
            isItem: obstacle.isItem,
            hasCollision: obstacle.hasCollision,
            purpose: obstacle.purpose
        };
    }
    getWallFromObstacle(obstacle, index, type, neighbor) {
        const isVertical = type === OBSTACLE_SIDES.TOP || type === OBSTACLE_SIDES.BOTTOM;
        let textureId = obstacle.textureId;
        if (neighbor === null || neighbor === void 0 ? void 0 : neighbor.isDoor) {
            textureId = isVertical ? 30 : 29;
        }
        return {
            position: this.getWallVectorFromObstacle(obstacle, type),
            type: isVertical ? INTERSECTION_TYPES.VERTICAL : INTERSECTION_TYPES.HORIZONTAL,
            shouldReverseTexture: !(neighbor === null || neighbor === void 0 ? void 0 : neighbor.isDoor) && (type === OBSTACLE_SIDES.LEFT || type === OBSTACLE_SIDES.BOTTOM),
            textureId: textureId,
            obstacleIdx: index,
            isMovable: obstacle.isMovable,
            isVisible: !obstacle.isSprite,
            isSprite: false,
            isItem: false,
            hasCollision: obstacle.hasCollision,
            purpose: null,
        };
    }
    getNeighbors(obstacle) {
        const neighbors = {
            [OBSTACLE_SIDES.TOP]: null,
            [OBSTACLE_SIDES.LEFT]: null,
            [OBSTACLE_SIDES.BOTTOM]: null,
            [OBSTACLE_SIDES.RIGHT]: null,
        };
        Object.keys(neighbors).forEach((side, i) => {
            const offset = NEIGHBOR_OFFSET[side];
            const axisY = this.map[(obstacle.y1 + (i % 2 === 0 ? offset : 0)) / TILE_SIZE];
            if (axisY) {
                const axisXValue = axisY[(obstacle.x1 + (i % 2 === 0 ? 0 : offset)) / TILE_SIZE];
                if (axisXValue) {
                    const isDoor = typeof axisXValue === 'number' && DOOR_IDS.includes(axisXValue);
                    const isSecret = typeof axisXValue === 'string';
                    neighbors[side] = {
                        isDoor,
                        isSecret,
                        isMovable: isDoor || isSecret,
                        number: typeof axisXValue === 'number' ? axisXValue : Number(axisXValue.split('_')[0]),
                    };
                }
            }
        });
        return neighbors;
    }
    getPlanes() {
        const position = this.actor.position;
        const angle = this.camera.angle;
        const leftExtremumAngle = angle - FOV;
        const rightExtremumAngle = angle + FOV;
        const currentAngleRayEndVertex = this.getVertexByPositionAndAngle(position, angle);
        const leftFOVExtremumVertex = this.getVertexByPositionAndAngle(currentAngleRayEndVertex, leftExtremumAngle);
        const rightFOVExtremumVertex = this.getVertexByPositionAndAngle(currentAngleRayEndVertex, rightExtremumAngle);
        const lengthBoundaries = {
            x1: position.x - RAY_LENGTH,
            y1: position.y - RAY_LENGTH,
            x2: position.x + RAY_LENGTH,
            y2: position.y + RAY_LENGTH,
        };
        const rangeBoundaries = {
            x1: position.x,
            y1: position.y,
            x2: leftFOVExtremumVertex.x,
            y2: leftFOVExtremumVertex.y,
            x3: rightFOVExtremumVertex.x,
            y3: rightFOVExtremumVertex.y,
        };
        const planes = this.obstacles.reduce((acc, obstacle, i) => {
            if (!obstacle.doesExist) {
                return acc;
            }
            const obstaclePos = obstacle.position;
            const obstacleNeighbors = this.getNeighbors(obstaclePos);
            if (obstacle.isSprite) {
                acc.push(this.getSpriteFromObstacle(obstacle, i));
            }
            if (obstacle.isDoor) {
                const type = obstacle.isVertical ? OBSTACLE_SIDES.TOP : OBSTACLE_SIDES.LEFT;
                acc.push(this.getWallFromObstacle(obstacle, i, type, null));
                return acc;
            }
            if (position.x <= obstaclePos.x1 && (!obstacleNeighbors.LEFT || obstacleNeighbors.LEFT.isMovable)) {
                acc.push(this.getWallFromObstacle(obstacle, i, OBSTACLE_SIDES.LEFT, obstacleNeighbors.LEFT));
            }
            if (position.x >= obstaclePos.x2 && (!obstacleNeighbors.RIGHT || obstacleNeighbors.RIGHT.isMovable)) {
                acc.push(this.getWallFromObstacle(obstacle, i, OBSTACLE_SIDES.RIGHT, obstacleNeighbors.RIGHT));
            }
            if (position.y <= obstaclePos.y1 && (!obstacleNeighbors.TOP || obstacleNeighbors.TOP.isMovable)) {
                acc.push(this.getWallFromObstacle(obstacle, i, OBSTACLE_SIDES.TOP, obstacleNeighbors.TOP));
            }
            if (position.y >= obstaclePos.y2 && (!obstacleNeighbors.BOTTOM || obstacleNeighbors.BOTTOM.isMovable)) {
                acc.push(this.getWallFromObstacle(obstacle, i, OBSTACLE_SIDES.BOTTOM, obstacleNeighbors.BOTTOM));
            }
            return acc;
        }, []);
        const planesByLength = planes.filter((plane) => plane.position.y1 >= lengthBoundaries.y1 &&
            plane.position.x1 >= lengthBoundaries.x1 &&
            plane.position.x2 <= lengthBoundaries.x2 &&
            plane.position.y2 <= lengthBoundaries.y2);
        const planesByRange = planes.filter((plane) => {
            const isLookingAt = !!this.camera.getViewAngleIntersection(plane.position);
            const { x1, y1, x2, y2 } = plane.position;
            return (isLookingAt ||
                this.getIsVertexInTheTriangle({ x: x1, y: y1 }, rangeBoundaries) ||
                this.getIsVertexInTheTriangle({ x: x2, y: y2 }, rangeBoundaries));
        });
        const planesByCameraVertexIntersections = planesByRange.filter((planeByRange) => {
            if (!planeByRange.isVisible) {
                return false;
            }
            return !planesByRange.some((innerPlaneByRange) => {
                return [
                    { x1: planeByRange.position.x1, y1: planeByRange.position.y1, x2: position.x, y2: position.y },
                    { x1: planeByRange.position.x2, y1: planeByRange.position.y2, x2: position.x, y2: position.y },
                ].every((plane) => {
                    if (innerPlaneByRange === planeByRange || !innerPlaneByRange.isVisible || innerPlaneByRange.isSprite) {
                        return false;
                    }
                    return !!Ray.getIntersectionVertexWithPlane(plane, innerPlaneByRange.position);
                });
            });
        });
        const walls = [];
        const sprites = [];
        const items = [];
        planesByCameraVertexIntersections.forEach((plane) => {
            if (isItem(plane)) {
                items.push(plane);
            }
            if (isSprite(plane)) {
                sprites.push(plane);
            }
            else if (isWall(plane)) {
                walls.push(plane);
            }
        });
        return {
            collisionObstacles: planesByLength.filter((plane) => plane.hasCollision),
            walls,
            sprites,
            items,
        };
    }
    getPositionChange(startPosition, endPosition) {
        if (startPosition > endPosition) {
            return -OBSTACLES_MOVE_SPEED;
        }
        else if (startPosition < endPosition) {
            return OBSTACLES_MOVE_SPEED;
        }
        return 0;
    }
    moveObstacles() {
        Object.keys(this.currentlyMovingObstacles).forEach((key) => {
            const obstacle = this.obstacles[Number(key)];
            const finalPosition = obstacle.isInStartPosition ? obstacle.endPosition : obstacle.initialPosition;
            this.obstacles[Number(key)].position = {
                x1: obstacle.position.x1 + this.getPositionChange(obstacle.position.x1, finalPosition.x1),
                y1: obstacle.position.y1 + this.getPositionChange(obstacle.position.y1, finalPosition.y1),
                x2: obstacle.position.x2 + this.getPositionChange(obstacle.position.x2, finalPosition.x2),
                y2: obstacle.position.y2 + this.getPositionChange(obstacle.position.y2, finalPosition.y2),
            };
            if (obstacle.position.x1 === finalPosition.x1 &&
                obstacle.position.y1 === finalPosition.y1 &&
                obstacle.position.x2 === finalPosition.x2 &&
                obstacle.position.y2 === finalPosition.y2) {
                obstacle.isInStartPosition = !obstacle.isInStartPosition;
                if (obstacle.isDoor && !obstacle.isInStartPosition) {
                    obstacle.closeTimeout = new Timeout(() => {
                        this.currentlyMovingObstacles[Number(key)] = obstacle;
                        obstacle.closeTimeout = null;
                    });
                    obstacle.closeTimeout.set(2000);
                }
                delete this.currentlyMovingObstacles[Number(key)];
            }
        });
    }
    handleKeyPress(event) {
        if (event.keyCode === 32) {
            let obstacleInViewIndex = null;
            let obstacleInView = null;
            for (let i = 0; i < this.obstacles.length; i++) {
                const obstacle = this.obstacles[i];
                if (!obstacle.isMovable) {
                    continue;
                }
                const intersection = this.camera.getViewAngleIntersection(obstacle.position);
                const distance = Math.sqrt((this.actor.position.x - obstacle.position.x1) ** 2 + (this.actor.position.y - obstacle.position.y1) ** 2);
                if (intersection && distance <= TILE_SIZE * 2) {
                    obstacleInViewIndex = i;
                    obstacleInView = obstacle;
                }
            }
            if (!obstacleInViewIndex ||
                !obstacleInView ||
                this.camera.hasEqualPosition(obstacleInView.position, obstacleInView.endPosition)) {
                return;
            }
            this.currentlyMovingObstacles[obstacleInViewIndex] = obstacleInView;
        }
    }
    parseMap(map) {
        const obstacles = [];
        let startPosition = { x: 0, y: 0 };
        let secretObstaclesEndPositions = {};
        for (let i = 0; i < map.length; i++) {
            for (let j = 0; j < map[i].length; j++) {
                const value = map[i][j];
                if (value && typeof value === 'string') {
                    const params = value.split('_');
                    if (params[2] === 'END') {
                        secretObstaclesEndPositions[params[1]] = {
                            x1: j * TILE_SIZE,
                            y1: i * TILE_SIZE,
                            x2: j * TILE_SIZE + TILE_SIZE,
                            y2: i * TILE_SIZE + TILE_SIZE,
                        };
                    }
                }
            }
        }
        for (let i = 0; i < map.length; i++) {
            for (let j = 0; j < map[i].length; j++) {
                let value = map[i][j];
                if (value) {
                    if (value === 'START_POS') {
                        startPosition = { x: j * TILE_SIZE - TILE_SIZE / 2, y: i * TILE_SIZE - TILE_SIZE / 2 };
                        continue;
                    }
                    const obstacleParams = typeof value === 'number' ? [] : value.split('_');
                    const textureId = typeof value !== 'number' ? Number(obstacleParams[0]) : value;
                    if (obstacleParams && obstacleParams.includes('END')) {
                        continue;
                    }
                    const isItem = obstacleParams.includes('ITEM');
                    const isSprite = obstacleParams.includes('SPRITE') || false;
                    const isSecret = !isSprite && obstacleParams.includes('START');
                    const isDoor = !isSprite && DOOR_IDS.includes(textureId);
                    const isMovable = !isSprite && (isDoor || isSecret);
                    const hasCollision = !obstacleParams.includes('HOLLOW');
                    let purpose = null;
                    if (isItem) {
                        purpose = ITEMS_PURPOSES[textureId];
                    }
                    const isVertical = !!(map[i][j - 1] && map[i][j + 1]);
                    const position = {
                        x1: j * TILE_SIZE + (!isVertical && isDoor ? TILE_SIZE * 0.5 : 0),
                        y1: i * TILE_SIZE + (isVertical && isDoor ? TILE_SIZE * 0.5 : 0),
                        x2: j * TILE_SIZE + (!isVertical && isDoor ? TILE_SIZE * 0.5 : TILE_SIZE),
                        y2: i * TILE_SIZE + (isVertical && isDoor ? TILE_SIZE * 0.5 : TILE_SIZE),
                    };
                    obstacles.push({
                        initialPosition: position,
                        position,
                        endPosition: isSecret && obstacleParams
                            ? secretObstaclesEndPositions[obstacleParams[1]]
                            : {
                                x1: isVertical ? position.x1 + TILE_SIZE : position.x1,
                                y1: !isVertical ? position.y1 - TILE_SIZE : position.y1,
                                x2: isVertical ? position.x2 + TILE_SIZE : position.x2,
                                y2: !isVertical ? position.y2 - TILE_SIZE : position.y2,
                            },
                        isDoor,
                        isSecret,
                        isInStartPosition: true,
                        isMovable,
                        isVertical,
                        isSprite,
                        doesExist: true,
                        hasCollision,
                        isItem,
                        textureId,
                        closeTimeout: null,
                        purpose,
                    });
                }
            }
        }
        return { obstacles, startPosition };
    }
}
class Timeout {
    constructor(onTimeoutExpire = () => { }) {
        this.timeoutTime = null;
        this.onTimeoutExpire = onTimeoutExpire;
    }
    get isExpired() {
        return !this.timeoutTime;
    }
    reset() {
        this.timeoutTime = null;
    }
    set(timeoutDuration) {
        this.timeoutTime = new Date().getTime() + timeoutDuration;
    }
    iterate() {
        if (this.timeoutTime) {
            const currentTime = new Date().getTime();
            if (currentTime > this.timeoutTime) {
                this.timeoutTime = null;
                this.onTimeoutExpire();
            }
        }
    }
}
const isSprite = (plane) => {
    return plane.isSprite;
};
const isWall = (plane) => {
    return !plane.isSprite;
};
const isItem = (plane) => {
    return plane.isItem;
};
const isItemObstacle = (obstacle) => {
    return obstacle.isItem;
};
const isDesiredPurpose = (purpose, type) => {
    return purpose.affects === type;
};
//# sourceMappingURL=build.js.map