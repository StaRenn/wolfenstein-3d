var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
        resolutionScaleRange.value = '3';
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
    });
}
window.onload = main;
const map = [[0, 0, 1, 1, 1, 1, 1, "1_ID617_END", 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 1, 1, 3, 1, 1, 1, 1, 3, 1, 1, 1, 1, 3, 3, 1, 1, 3, 1, 1, 3, 3, 1, 1, 3, 3, 3], [0, 0, 1, "39_SPRITE_HOLLOW_ITEM", 0, 0, 0, 0, "41_SPRITE_HOLLOW_ITEM", "39_SPRITE_HOLLOW_ITEM", "39_SPRITE_HOLLOW_ITEM", 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 3, 1, 1, 1, 3, 3, "5_ID6037_END", 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 3], [37, 37, 1, 3, "1_ID614_START", 3, 1, "1_ID617_START", 3, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, "35_SPRITE_HOLLOW_ITEM", "35_SPRITE_HOLLOW_ITEM", 0, 0, 0, 0, 0, 1, "39_SPRITE_HOLLOW_ITEM", 0, "39_SPRITE_HOLLOW_ITEM", 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, "24_SPRITE_HOLLOW", 0, 27, 0, "24_SPRITE_HOLLOW", 0, 0, 0, "24_SPRITE_HOLLOW", 0, 5], [37, 0, 0, 0, 0, 1, 1, "34_SPRITE_HOLLOW_ITEM", "34_SPRITE_HOLLOW_ITEM", "34_SPRITE_HOLLOW_ITEM", "1_ID5810_END", 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, "35_SPRITE_HOLLOW_ITEM", "11_SPRITE", 0, 0, 0, "11_SPRITE", 0, 3, 1, "5_ID6037_START", 1, 3, 0, 0, 3, 0, 0, 0, 0, 0, 1, 0, 0, 3, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1], [37, 0, 37, 1, "1_ID614_END", 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 3, 1, 1, 3, 1, 0, 0, 0, 3], [37, 0, 37, 1, 1, 1, 1, 1, 3, 1, "1_ID5810_START", 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, "25_SPRITE_HOLLOW", 0, 0, 0, 27, 0, "24_SPRITE_HOLLOW", 0, 27, 0, 0, 0, 0, 0, "24_SPRITE_HOLLOW", 0, 0, 0, 0, 0, 27, 0, 0, 0, 1, "42_SPRITE_HOLLOW_ITEM", "38_SPRITE_HOLLOW_ITEM", "42_SPRITE_HOLLOW_ITEM", 3, 0, 0, 0, 1], [37, 0, 37, 3, "34_SPRITE_HOLLOW_ITEM", 0, 0, 0, "34_SPRITE_HOLLOW_ITEM", 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, "38_SPRITE_HOLLOW_ITEM", "42_SPRITE_HOLLOW_ITEM", "38_SPRITE_HOLLOW_ITEM", 1, 0, 0, 0, 1], [37, 0, 37, 1, 0, 0, 0, 0, 0, 0, "39_SPRITE_HOLLOW_ITEM", 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, "11_SPRITE", "23_SPRITE_HOLLOW", 0, 0, "11_SPRITE", 0, 3, 0, 0, 0, 3, 0, 0, 1, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 0, 0, 1, "42_SPRITE_HOLLOW_ITEM", "38_SPRITE_HOLLOW_ITEM", "42_SPRITE_HOLLOW_ITEM", 1, 0, 0, 0, 1], [37, 0, 37, 3, 1, 3, 1, 0, 1, 3, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 1, "36_SPRITE_HOLLOW_ITEM", "42_SPRITE_HOLLOW_ITEM", "36_SPRITE_HOLLOW_ITEM", 1, 0, 0, 0, 1], [37, 0, 37, 0, 0, 1, 1, 27, 1, 1, 1, 1, 3, 1, 1, 11, 1, 1, 1, 0, 0, 3, 1, 3, 1, 3, 0, 1, 3, 1, 3, 3, 1, 1, 3, 1, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 3, "42_SPRITE_HOLLOW_ITEM", "36_SPRITE_HOLLOW_ITEM", "42_SPRITE_HOLLOW_ITEM", 3, 0, 0, 0, 1], [37, 0, 37, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 3, 0, 1, 0, 0, 0, 1, 0, 3, "1_SPRITE", 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 3, 1, 1, 1, 1, 1, 27, 1, 1, 3, 3, 1, 1, 0, 0, 0, 1, "36_SPRITE_HOLLOW_ITEM", "42_SPRITE_HOLLOW_ITEM", "36_SPRITE_HOLLOW_ITEM", 1, 0, 0, 0, 1], [37, 0, 37, 1, 1, "1_SPRITE", 0, 0, 0, 0, 0, 3, "1_SPRITE", 0, 0, 0, 0, 0, 0, 1, 1, 3, 0, 0, 0, 3, 1, 1, 0, 0, "22_SPRITE_HOLLOW", 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 1, 0, 0, 0, 1], [37, 0, 37, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 3, 0, "24_SPRITE_HOLLOW", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, "24_SPRITE_HOLLOW", 0, 3, 0, 0, 0, 1, 0, 0, 0, 3], [37, 0, 37, 3, 0, 0, 0, "25_SPRITE_HOLLOW", 0, 0, 0, 27, 0, 0, 0, "25_SPRITE_HOLLOW", 0, 0, 0, 27, 0, 0, 0, "25_SPRITE_HOLLOW", 0, 0, 0, 27, 0, 0, 0, "25_SPRITE_HOLLOW", 0, 0, 0, 27, 0, "24_SPRITE_HOLLOW", 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 3, 0, 0, 0, 1], [37, 0, 37, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, "16_SPRITE", 1, "1_SPRITE", 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 27, 1, 1, 1, 1, 3, 3, 1, 3, 3, 1, 1, 3, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1], [37, 0, 37, 3, 0, "14_SPRITE", 0, 0, 0, "13_SPRITE", 0, 3, 0, "22_SPRITE_HOLLOW", 0, 0, 0, "16_SPRITE", "16_SPRITE", 3, "1_SPRITE", "1_SPRITE", 0, 0, 0, 3, 3, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1], [37, 0, 37, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, "35_SPRITE_HOLLOW_ITEM", 1, "1_SPRITE", "1_SPRITE", 0, 0, 0, 1, 0, 3, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 1], [37, 0, 37, 1, 1, 3, 1, 1, 3, 1, 1, 1, 1, 3, 1, 27, 1, 3, 1, 1, 3, 1, 3, 1, 3, 1, 0, 3, 1, 1, 3, 1, 1, 1, 1, 3, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 3], [37, 0, 37, 1, 1, "12_SPRITE", 1, "12_SPRITE", 3, "12_SPRITE", 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 11, 0, "24_SPRITE_HOLLOW", 0, "11_ID4543_START", 0, "11_ID4543_END", 1, 1, 3, 3, 1, 3, 1, 3, 3, 1, 1, 1, 1, 3, 0, 0, 0, 1], [37, 0, 37, 1, "12_SPRITE", 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, "18_SPRITE", 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, "6_SPRITE", 0, 0, 0, "6_SPRITE", 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 31, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 1], [37, 0, 37, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 3, 0, 31, 0, 33, 0, "24_SPRITE_HOLLOW", 0, 0, 0, 0, 0, 0, 0, "24_SPRITE_HOLLOW", 0, 1, 0, 0, 0, 1], [37, 0, 37, 1, "12_SPRITE", 0, 0, "25_SPRITE_HOLLOW", 0, 0, 0, 27, 0, 0, 0, "25_SPRITE_HOLLOW", 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, "25_SPRITE_HOLLOW", 0, 0, 0, 27, 0, "24_SPRITE_HOLLOW", 0, 3, 0, 0, 0, 3, 0, 1, 31, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 1], [37, 0, 37, 1, 3, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 35, 3, 1, 1, 3, 1, 3, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 3], [37, 0, 37, 1, "12_SPRITE", 0, 0, 0, 0, 0, 0, 3, "16_SPRITE", 0, 0, 0, 0, 0, "17_SPRITE", 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, "6_SPRITE", 0, 0, 0, "6_SPRITE", 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1], [37, 0, 37, 1, 1, 0, 0, 0, 0, 0, 0, 1, "16_SPRITE", "16_SPRITE", 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, "24_SPRITE_HOLLOW", 0, 1, 0, 0, 0, 1, 0, 0, 0, 1], [37, 0, 37, 0, 1, 1, 1, 27, 1, 1, 3, 1, 3, 1, 3, 3, 1, 3, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 27, 1, 1, 1, 1, 0, 0, 0, 3, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, "38_SPRITE_HOLLOW_ITEM", 0, "38_SPRITE_HOLLOW_ITEM", 1, 0, 0, 0, 3, 0, 0, 0, 3], [37, 0, 37, 1, 1, 0, 0, 0, 0, 0, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 3, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1], [37, 0, 37, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, "2_SPRITE", 0, 0, 0, "2_SPRITE", 0, 3, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 1], [37, 0, 37, 1, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 3, 0, "24_SPRITE_HOLLOW", 0, 0, 0, 0, 0, 0, 0, "24_SPRITE_HOLLOW", 0, 0, 0, 0, 0, 0, 0, "24_SPRITE_HOLLOW", 0, 3, 0, "24_SPRITE_HOLLOW", 0, 1], [37, 0, 37, 3, 0, 0, 0, "25_SPRITE_HOLLOW", 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, "25_SPRITE_HOLLOW", 0, 0, 0, 27, 0, "24_SPRITE_HOLLOW", 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 3], [37, 0, 37, 1, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 3, 1, 5, 3, 3, 1, 1, 1, 1, 1, 3, 3, 5, 3, 1, 1, 3, 1, 1, 3, 1, 11, 27, 11, 1], [37, 0, 37, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, "2_SPRITE", 0, 0, 0, "2_SPRITE", 0, 3, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], [37, 0, 37, 3, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 3, 7, 1, 3, 3, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3], [37, 0, 37, 1, 3, 3, 1, 27, 1, 3, 3, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 3, 3, 1, 3, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], [37, 0, 37, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 3, 11, 3, 11, 3, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 3, 0, "38_SPRITE_HOLLOW_ITEM", 0, "35_SPRITE_HOLLOW_ITEM", 0, 1, 1, 0, 0, 0, 3, 0, 0, 0, 23, 23, 23, 23, 21, 23, 27, 23, 23, 23, 27, 23, 21, 23, 23, 23, 23, 0, 0, 0, 1], [37, 0, 37, 3, 0, "6_SPRITE", 0, 0, 0, "6_SPRITE", 0, 1, 0, "10_SPRITE", 0, "10_SPRITE", 0, "10_SPRITE", 0, 3, 0, 0, 0, 0, 0, 0, 0, 3, 0, "7_SPRITE", 0, "38_SPRITE_HOLLOW_ITEM", 0, "7_SPRITE", 0, 1, 0, 0, 0, 1, 0, 0, 0, 23, 0, 0, 0, 0, 0, 0, 0, 23, 0, 0, 0, 0, 0, 0, 0, 23, 0, 0, 0, 1], [37, 0, 37, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, "38_SPRITE_HOLLOW_ITEM", "38_SPRITE_HOLLOW_ITEM", 0, "36_SPRITE_HOLLOW_ITEM", 1, 0, 0, 0, 1, 0, 0, 0, 23, "38_SPRITE_HOLLOW_ITEM", 0, "2_SPRITE", 0, "2_SPRITE", 0, "38_SPRITE_HOLLOW_ITEM", 23, 0, 0, "2_SPRITE", 0, "2_SPRITE", 0, 0, 23, 0, 0, 0, 1], [37, 0, 37, 3, 0, "6_SPRITE", 0, "25_SPRITE_HOLLOW", 0, 0, 0, 27, 0, 0, 0, "25_SPRITE_HOLLOW", 0, 0, 0, 27, 0, 0, 0, "25_SPRITE_HOLLOW", 0, 0, 0, 27, 0, 0, 0, "25_SPRITE_HOLLOW", 0, 0, "36_SPRITE_HOLLOW_ITEM", 3, 0, 0, 0, 7, 0, 0, 0, 23, 0, 0, 0, 0, 0, 0, 0, 23, 0, 0, 0, 0, 0, 0, 0, 23, 0, 0, 0, 7], [37, 0, 37, 1, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, "35_SPRITE_HOLLOW_ITEM", 0, 1, 0, 0, 0, 1, 0, 0, 0, 23, 0, 0, "2_SPRITE", 0, "2_SPRITE", 0, 0, 23, "36_SPRITE_HOLLOW_ITEM", 0, "2_SPRITE", 0, "2_SPRITE", 0, "34_SPRITE_HOLLOW_ITEM", 23, 0, 0, 0, 1], [37, 0, 37, 1, 0, "6_SPRITE", 0, "6_SPRITE", 0, "6_SPRITE", 0, 1, 0, "10_SPRITE", 0, "10_SPRITE", 0, "10_SPRITE", 0, 3, 0, 0, 0, 0, 0, 0, 0, 3, 0, "7_SPRITE", 0, "42_SPRITE_HOLLOW_ITEM", "42_SPRITE_HOLLOW_ITEM", "7_SPRITE", 0, 1, 0, 0, 0, 3, 0, 0, 0, 23, 0, 0, "42_SPRITE_HOLLOW_ITEM", "39_SPRITE_HOLLOW_ITEM", "38_SPRITE_HOLLOW_ITEM", 0, 0, 23, "36_SPRITE_HOLLOW_ITEM", "36_SPRITE_HOLLOW_ITEM", 0, "42_SPRITE_HOLLOW_ITEM", "42_SPRITE_HOLLOW_ITEM", "34_SPRITE_HOLLOW_ITEM", "34_SPRITE_HOLLOW_ITEM", 23, 0, 0, 0, 1], [37, 0, 37, 3, 0, 0, 0, 0, 0, 0, 0, 1, 1, 3, 11, 1, 11, 1, 1, 3, 0, 0, 0, 0, 0, 0, 0, 1, 1, "36_SPRITE_HOLLOW_ITEM", "36_SPRITE_HOLLOW_ITEM", "35_SPRITE_HOLLOW_ITEM", "42_SPRITE_HOLLOW_ITEM", "42_SPRITE_HOLLOW_ITEM", 3, 3, 0, 0, 0, 1, 0, 0, 0, 23, 23, 23, 23, 19, 23, 23, 23, 23, 23, 23, 23, 19, 23, 23, 23, 23, 0, 0, 0, 3], [37, 0, 37, 1, 3, 1, 1, 1, 3, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 3, 1, 1, 3, 1, 1, 3, 3, 1, 1, 1, 3, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], [37, 0, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], [37, 0, 0, 0, 0, 0, 0, 0, 0, "38_SPRITE_HOLLOW_ITEM", "36_SPRITE_HOLLOW_ITEM", "38_SPRITE_HOLLOW_ITEM", "36_SPRITE_HOLLOW_ITEM", "36_SPRITE_HOLLOW_ITEM", "38_SPRITE_HOLLOW_ITEM", 37, 1, 0, 0, 0, "24_SPRITE_HOLLOW", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, "24_SPRITE_HOLLOW", 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], [37, "39_SPRITE_HOLLOW_ITEM", 0, 0, 0, 0, 0, 0, 0, "36_SPRITE_HOLLOW_ITEM", "42_SPRITE_HOLLOW_ITEM", "38_SPRITE_HOLLOW_ITEM", "38_SPRITE_HOLLOW_ITEM", "38_SPRITE_HOLLOW_ITEM", "42_SPRITE_HOLLOW_ITEM", 37, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 5, 3, 1, 1, 3, 1, 1, 3, 1, 3, 5, 1, 1, 3, 1, 1, 3, 1, 3, 3, 5, 1, 1], [37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 1, 3, 1, 3, 27, 1, 1, 1, 1, 1, 1, 1, 3, 27, 3, 1, 1, 1, 1, 1, 1, 1, 3, 15, 15, 17, 17, 15, 15, 17, 15, 15, 17, 17, 15, 17, 17, 15, 17, 15, 15, 17, 15, 17, 15, 17, 17, 17], [1, 1, 3, 1, 1, 1, 3, 1, 0, 3, 1, 11, 3, 1, 0, 3, 1, 3, 1, 0, 0, 0, 1, 5, 3, 3, 5, 3, 0, 0, 0, 3, 3, 1, 0, 3, 1, 1, 1, 15, 0, 0, 0, 0, 0, 17, 0, 0, 0, 0, "35_SPRITE_HOLLOW_ITEM", 15, 0, 0, 0, 0, 0, 15, "23_SPRITE_HOLLOW", 0, 0, "35_SPRITE_HOLLOW_ITEM", 0, 15], [1, 0, 0, 0, 0, 0, 0, 1, 5, 3, 0, 0, 0, 1, 7, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 11, 1, 0, 0, 1, 15, 0, 0, "2_SPRITE", "26_SPRITE_HOLLOW", 0, 17, 0, 0, "2_SPRITE", 0, 0, 17, 0, 0, "2_SPRITE", 0, 0, 17, 0, 0, "2_SPRITE", 0, 0, 17], [3, 0, "24_SPRITE_HOLLOW", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, "24_SPRITE_HOLLOW", 0, 0, 0, 0, 0, 0, 0, 0, "24_SPRITE_HOLLOW", 0, 0, 0, 0, 0, 0, "24_SPRITE_HOLLOW", 0, 1, 17, 0, 0, "24_SPRITE_HOLLOW", "35_SPRITE_HOLLOW_ITEM", 0, 17, 0, 0, "24_SPRITE_HOLLOW", 0, 0, 15, 0, 0, "24_SPRITE_HOLLOW", "23_SPRITE_HOLLOW", 0, 15, 0, 0, "24_SPRITE_HOLLOW", 0, 0, 15], [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 17, 0, 0, 0, 0, 0, 17, 0, 0, 0, 0, "26_SPRITE_HOLLOW", 17, 0, 0, 0, 0, 0, 17, 0, 0, 0, 0, 0, 15], [1, 0, 0, 0, 0, 0, 0, 1, 5, 1, 0, 0, 0, 1, 7, 1, 0, 0, 0, 1, 11, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 15, 0, 0, 0, 0, 0, 15, 0, 0, 0, 0, 0, 17, 0, 0, 0, 0, 0, 15, 0, 0, 0, 0, 0, 17], [3, 0, 0, 0, 0, 1, 3, 1, 3, 3, 1, "11_ID1211_START", 1, 1, 3, 1, 1, 1, 3, 3, 11, 1, 1, 1, 1, 1, 3, 1, 1, "1_ID1229_START", 1, 1, 3, 3, 1, 0, 0, 0, 1, 17, 15, 15, 27, 15, 17, 15, 17, 15, 27, 15, 17, 15, 17, 15, 27, 15, 15, 17, 15, 15, 27, 15, 15, 15], [1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, "36_SPRITE_HOLLOW_ITEM", "38_SPRITE_HOLLOW_ITEM", "42_SPRITE_HOLLOW_ITEM", 0, 0, 3, 0, 0, 0, 1, 0, 0, 0, "42_SPRITE_HOLLOW_ITEM", 0, 1, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9], [0, 5, 0, 0, 5, 5, "34_SPRITE_HOLLOW_ITEM", 0, 0, 0, 0, "11_ID1211_END", 11, "38_SPRITE_HOLLOW_ITEM", "2_SPRITE", "24_SPRITE_HOLLOW", 0, 0, 27, 0, "24_SPRITE_HOLLOW", 0, 27, 0, 0, "24_SPRITE_HOLLOW", "2_SPRITE", 0, 11, "1_ID1229_END", 0, 0, 0, "34_SPRITE_HOLLOW_ITEM", 5, 0, 0, 0, 0, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15], [1, 1, 0, 0, 1, 1, "34_SPRITE_HOLLOW_ITEM", "34_SPRITE_HOLLOW_ITEM", 0, 0, 0, 1, 1, "38_SPRITE_HOLLOW_ITEM", 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, "38_SPRITE_HOLLOW_ITEM", 3, 1, 0, 0, "34_SPRITE_HOLLOW_ITEM", "34_SPRITE_HOLLOW_ITEM", 1, 0, 0, 0, 0, 27, 0, 0, "24_SPRITE_HOLLOW", 0, 0, 0, 0, 0, "24_SPRITE_HOLLOW", 0, 0, 0, 0, 0, "24_SPRITE_HOLLOW", 0, 0, 0, 0, 0, "24_SPRITE_HOLLOW", 0, 0, 9], [3, 0, 0, 0, 0, 1, 1, 1, 3, 3, 3, 3, 1, 1, 1, 3, 3, 1, 1, 1, 27, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 3, 1, 1, 0, 0, 0, 0, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15], [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 13], [1, 0, "24_SPRITE_HOLLOW", 0, 0, 0, 0, 0, 0, 0, 0, 0, 27, 0, 0, "24_SPRITE_HOLLOW", 0, 0, 0, 0, "24_SPRITE_HOLLOW", 0, 0, 0, 0, "24_SPRITE_HOLLOW", 0, 0, 27, 0, 0, 0, 0, 0, 0, 0, "24_SPRITE_HOLLOW", 0, 1, 17, 17, 15, 27, 15, 17, 17, 15, 17, 27, 15, 17, 15, 15, 15, 27, 15, 17, 15, 15, 15, 27, 15, 17, 15], [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 17, 0, 0, 0, 0, 0, 15, 0, "23_SPRITE_HOLLOW", 0, 0, 0, 15, 0, 0, 0, 0, 0, 15, 0, 0, 0, 0, 0, 15], [3, 1, "1_ID42_START", 1, 3, 1, 3, 3, 1, 3, 1, 3, 1, 1, 3, 1, 3, 3, 1, 0, 0, 0, 1, 1, 3, 1, 3, 1, 1, 1, 1, 1, 3, 3, 3, 3, 1, 3, 3, 15, 0, 0, 0, 0, 0, 17, 0, 0, 0, 0, 0, 17, 0, 0, "35_SPRITE_HOLLOW_ITEM", 0, 0, 17, 0, 0, 0, 0, 0, 17], [0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, "41_SPRITE_HOLLOW_ITEM", "39_SPRITE_HOLLOW_ITEM", 1, 0, 0, 0, 0, 0, 1, "39_SPRITE_HOLLOW_ITEM", "39_SPRITE_HOLLOW_ITEM", "42_SPRITE_HOLLOW_ITEM", "42_SPRITE_HOLLOW_ITEM", 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 15, 0, 0, "24_SPRITE_HOLLOW", 0, 0, 15, "35_SPRITE_HOLLOW_ITEM", 0, "24_SPRITE_HOLLOW", 0, 0, 15, 0, 0, "24_SPRITE_HOLLOW", "23_SPRITE_HOLLOW", 0, 15, 0, 0, "24_SPRITE_HOLLOW", 0, 0, 15], [0, 1, "1_ID42_END", 0, 0, 0, 0, 0, 0, "34_SPRITE_HOLLOW_ITEM", "42_SPRITE_HOLLOW_ITEM", "42_SPRITE_HOLLOW_ITEM", 1, 0, 0, 0, "39_SPRITE_HOLLOW_ITEM", 11, 0, 0, 0, 0, 0, 11, "34_SPRITE_HOLLOW_ITEM", "34_SPRITE_HOLLOW_ITEM", 0, "42_SPRITE_HOLLOW_ITEM", 0, 0, 0, 0, 0, 0, 0, 0, 1, "15_ID239_END", 0, "15_ID239_START", "26_SPRITE_HOLLOW", 0, "2_SPRITE", 0, 0, 15, 0, 0, "2_SPRITE", 0, 0, 17, "35_SPRITE_HOLLOW_ITEM", 0, "2_SPRITE", 0, 0, 17, 0, 0, "2_SPRITE", "26_SPRITE_HOLLOW", 0, 15], [0, 1, 1, 0, 0, 0, 0, 0, "34_SPRITE_HOLLOW_ITEM", 0, "34_SPRITE_HOLLOW_ITEM", "42_SPRITE_HOLLOW_ITEM", "1_ID112_START", 0, "1_ID112_END", 1, 1, 1, 0, 0, "START_POS", 0, 0, 1, "34_SPRITE_HOLLOW_ITEM", "34_SPRITE_HOLLOW_ITEM", "34_SPRITE_HOLLOW_ITEM", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 0, 0, 0, 0, 0, 17, 0, 0, 0, 0, 0, 17, "35_SPRITE_HOLLOW_ITEM", "35_SPRITE_HOLLOW_ITEM", 0, 0, 0, 17, 0, 0, 0, "35_SPRITE_HOLLOW_ITEM", "35_SPRITE_HOLLOW_ITEM", 17], [0, 0, 1, 1, 1, 3, 3, 1, 3, 3, 3, 3, 3, 1, 1, 1, 0, 1, 1, 1, 33, 1, 3, 1, 1, 3, 1, 1, 1, 3, 3, 1, 1, 3, 3, 1, 3, 3, 1, 17, 15, 17, 17, 15, 15, 15, 15, 17, 17, 17, 17, 17, 17, 17, 17, 15, 15, 15, 15, 15, 15, 15, 15, 17]];
let RESOLUTIONS_SCALE_VALUES = [0.1, 0.25, 0.5, 1];
let RESOLUTION_SCALE = 1;
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
const ITEMS_PURPOSES = {
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
        value: 'MACHINE_GUN',
    },
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
    [OBSTACLE_SIDES.TOP]: -1,
    [OBSTACLE_SIDES.BOTTOM]: 1,
    [OBSTACLE_SIDES.LEFT]: -1,
    [OBSTACLE_SIDES.RIGHT]: 1,
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
    constructor(ctx, screenData, initialPosition) {
        this.ammo = 50;
        this.score = 0;
        this.ctx = ctx;
        this.currentWeapon = 'PISTOL';
        this.health = 20;
        this.horizontalSpeed = 0;
        this.lives = 3;
        this.level = 1;
        this.position = initialPosition;
        this.screenData = screenData;
        this.verticalSpeed = 0;
        this.weapons = ['KNIFE', 'PISTOL'];
        this.isShooting = false;
        this.renderWeapon = this.renderWeapon.bind(this);
        this.camera = new Camera(this.position, this.screenData.screenWidth * RESOLUTION_SCALE, this.ctx);
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
    get currentMatrixPosition() {
        return {
            x: Math.floor(this.position.x / TILE_SIZE),
            y: Math.floor(this.position.y / TILE_SIZE),
        };
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
    move(gameMap) {
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
        const checkCollision = (obstacle) => {
            if (!obstacle || (!obstacle.hasCollision && !obstacle.isItem)) {
                return;
            }
            let doesCollide = false;
            const preparedObstaclePosition = Object.assign({}, (obstacle.isInFinalPosition && !obstacle.isDoor ? obstacle.endPosition : obstacle.initialPosition));
            if (obstacle.isDoor) {
                if (preparedObstaclePosition.x1 === preparedObstaclePosition.x2) {
                    preparedObstaclePosition.x1 -= TILE_SIZE / 2;
                    preparedObstaclePosition.x2 += TILE_SIZE / 2;
                }
                if (preparedObstaclePosition.y1 === preparedObstaclePosition.y2) {
                    preparedObstaclePosition.y1 -= TILE_SIZE / 2;
                    preparedObstaclePosition.y2 += TILE_SIZE / 2;
                }
            }
            const expandedObstacleVector = {
                x1: preparedObstaclePosition.x1 - TILE_SIZE * 0.3,
                y1: preparedObstaclePosition.y1 - TILE_SIZE * 0.3,
                x2: preparedObstaclePosition.x2 + TILE_SIZE * 0.3,
                y2: preparedObstaclePosition.y2 + TILE_SIZE * 0.3,
            };
            if (position.x >= expandedObstacleVector.x1 &&
                position.x <= expandedObstacleVector.x2 &&
                position.y >= expandedObstacleVector.y1 &&
                position.y <= expandedObstacleVector.y2) {
                if (!obstacle.isItem) {
                    if (this.position.x >= expandedObstacleVector.x1 && this.position.x <= expandedObstacleVector.x2) {
                        position.y = this.position.y;
                    }
                    if (this.position.y >= expandedObstacleVector.y1 && this.position.y <= expandedObstacleVector.y2) {
                        position.x = this.position.x;
                    }
                }
                doesCollide = true;
            }
            if (doesCollide && isItemObstacle(obstacle)) {
                const purpose = obstacle.purpose;
                if (isDesiredPurpose(purpose, 'ammo')) {
                    if (this.ammo === 100) {
                        return;
                    }
                    this.ammo += purpose.value;
                    if (this.ammo > 100) {
                        this.ammo = 100;
                    }
                }
                if (isDesiredPurpose(purpose, 'health')) {
                    if (this.health === 100) {
                        return;
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
                gameMap[obstacle.matrixCoordinates.y][obstacle.matrixCoordinates.x] = null;
            }
        };
        const positionOnMap = this.currentMatrixPosition;
        checkCollision((gameMap[positionOnMap.y - 1] || [])[positionOnMap.x - 1]);
        checkCollision((gameMap[positionOnMap.y - 1] || [])[positionOnMap.x]);
        checkCollision((gameMap[positionOnMap.y - 1] || [])[positionOnMap.x + 1]);
        checkCollision((gameMap[positionOnMap.y] || [])[positionOnMap.x - 1]);
        checkCollision((gameMap[positionOnMap.y] || [])[positionOnMap.x + 1]);
        checkCollision((gameMap[positionOnMap.y + 1] || [])[positionOnMap.x - 1]);
        checkCollision((gameMap[positionOnMap.y + 1] || [])[positionOnMap.x]);
        checkCollision((gameMap[positionOnMap.y + 1] || [])[positionOnMap.x + 1]);
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
    constructor(position, raysAmount, ctx) {
        this.getRelativeChunkMultiplier = (distance) => {
            let relativeChunkMultiplier;
            if (distance < TILE_SIZE / 2) {
                relativeChunkMultiplier = 32;
            }
            else if (distance < TILE_SIZE * 3) {
                relativeChunkMultiplier = 16;
            }
            else if (distance < TILE_SIZE * 6) {
                relativeChunkMultiplier = 8;
            }
            else {
                relativeChunkMultiplier = 1;
            }
            return relativeChunkMultiplier;
        };
        this.angle = this.toRadians(180);
        this.ctx = ctx;
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
    getIntersections(gameMap, nonGridPlanes) {
        const intersections = [];
        for (let i = 0; i < this.rays.length; i++) {
            const nonGridCastResult = this.rays[i].cast(nonGridPlanes);
            if (nonGridCastResult) {
                const relativeChunkMultiplier = this.getRelativeChunkMultiplier(nonGridCastResult.distance);
                intersections.push(Object.assign(Object.assign({}, nonGridCastResult), { distance: Math.round(nonGridCastResult.distance * relativeChunkMultiplier) / relativeChunkMultiplier, index: i }));
            }
            this.rays[i].castDDA(gameMap).forEach(({ obstacle, intersectionVertex, distance }) => {
                const obstaclePos = obstacle.position;
                const relativeChunkMultiplier = this.getRelativeChunkMultiplier(distance);
                let preparedIntersection = intersectionVertex;
                let preparedDistance = Math.round(distance * relativeChunkMultiplier) / relativeChunkMultiplier;
                const obstacleNeighbors = obstacle.getNeighbors(gameMap);
                let plane = null;
                if (obstacle.isSprite) {
                    plane = obstacle.getSpriteFromObstacle(obstacle, this.angle);
                    const castResult = this.rays[i].cast([plane]);
                    if (castResult) {
                        preparedDistance = Math.round(castResult.distance * relativeChunkMultiplier) / relativeChunkMultiplier;
                        preparedIntersection = castResult.intersectionVertex;
                    }
                    else {
                        return;
                    }
                }
                else {
                    if (preparedIntersection.y !== obstaclePos.y1 && preparedIntersection.x === obstaclePos.x1) {
                        plane = obstacle.getWallFromObstacle(obstacle, OBSTACLE_SIDES.LEFT, obstacleNeighbors.LEFT);
                    }
                    if (preparedIntersection.y !== obstaclePos.y1 && preparedIntersection.x === obstaclePos.x2) {
                        plane = obstacle.getWallFromObstacle(obstacle, OBSTACLE_SIDES.RIGHT, obstacleNeighbors.RIGHT);
                    }
                    if (preparedIntersection.y === obstaclePos.y1 && preparedIntersection.x !== obstaclePos.x1) {
                        plane = obstacle.getWallFromObstacle(obstacle, OBSTACLE_SIDES.TOP, obstacleNeighbors.TOP);
                    }
                    if (preparedIntersection.y === obstaclePos.y2 && preparedIntersection.x !== obstaclePos.x1) {
                        plane = obstacle.getWallFromObstacle(obstacle, OBSTACLE_SIDES.BOTTOM, obstacleNeighbors.BOTTOM);
                    }
                }
                if (plane) {
                    intersections.push({
                        plane: plane,
                        distance: preparedDistance,
                        index: i,
                        intersectionVertex: preparedIntersection,
                    });
                }
            });
        }
        return intersections;
    }
    changeRaysAmount(raysAmount) {
        this.rays = [];
        const trueRaysAmount = Math.floor(raysAmount * RESOLUTION_SCALE);
        const screenHalfLength = Math.tan(FOV / 2);
        const segmentLength = screenHalfLength / (trueRaysAmount / 2);
        for (let i = 0; i < trueRaysAmount; i++) {
            let rayAngle = this.angle + Math.atan(segmentLength * i - screenHalfLength);
            if (rayAngle < 0) {
                rayAngle += Math.PI * 2;
            }
            if (rayAngle > Math.PI * 2) {
                rayAngle -= Math.PI * 2;
            }
            this.rays.push(new Ray(this.position, rayAngle, this.angle));
        }
    }
    rotate(event) {
        this.angle += this.toRadians(event.movementX / 3);
        this.angle = this.angle % (2 * Math.PI);
        if (this.angle < 0) {
            this.angle += 2 * Math.PI;
        }
        const screenHalfLength = Math.tan(FOV / 2);
        const segmentLength = screenHalfLength / ((Math.floor(this.rays.length / 10) * 10) / 2);
        for (let i = 0; i < this.rays.length; i++) {
            let rayAngle = this.angle + Math.atan(segmentLength * i - screenHalfLength);
            if (rayAngle < 0) {
                rayAngle += Math.PI * 2;
            }
            if (rayAngle > Math.PI * 2) {
                rayAngle -= Math.PI * 2;
            }
            this.rays[i].changeAngle(rayAngle, this.angle);
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
    render(position, angle) {
        const endPosition = {
            x: position.x + (TILE_SIZE / MAP_SCALE) * Math.sin(angle),
            y: position.y + (TILE_SIZE / MAP_SCALE) * Math.cos(angle),
        };
        const height = this.rowsLength * TILE_SIZE;
        for (let obstacle of this.obstacles) {
            if (obstacle.isSecret) {
                this.ctx.fillStyle = 'orange';
            }
            else {
                this.ctx.fillStyle = 'white';
            }
            if (!obstacle.isDoor && !obstacle.isSprite) {
                this.ctx.fillRect(obstacle.initialPosition.x1 * MAP_SCALE, (height - obstacle.initialPosition.y1 - TILE_SIZE) * MAP_SCALE, TILE_SIZE * MAP_SCALE, TILE_SIZE * MAP_SCALE);
            }
        }
        this.ctx.strokeStyle = 'orange';
        this.ctx.beginPath();
        this.ctx.moveTo(position.x * MAP_SCALE, (height - position.y) * MAP_SCALE);
        this.ctx.lineTo(endPosition.x * MAP_SCALE, (height - endPosition.y) * MAP_SCALE);
        this.ctx.closePath();
        this.ctx.stroke();
        this.ctx.fillStyle = 'red';
        this.ctx.ellipse(position.x * MAP_SCALE, (height - position.y) * MAP_SCALE, TILE_SIZE * 0.8 * MAP_SCALE, TILE_SIZE * 0.8 * MAP_SCALE, 0, 0, 360);
        this.ctx.fill();
    }
}
class Obstacle {
    constructor(params) {
        this.textureId = params.textureId;
        this.isDoor = params.isDoor;
        this.isSecret = params.isSecret;
        this.isVertical = params.isVertical;
        this.isMovable = params.isMovable;
        this.isSprite = params.isSprite;
        this.isItem = params.isItem;
        this.rawValue = params.rawValue;
        this.purpose = params.purpose;
        this.matrixCoordinates = params.matrixCoordinates;
        this.initialPosition = params.initialPosition;
        this.position = params.position;
        this.endPosition = params.endPosition;
        this.closeTimeout = params.closeTimeout;
        this.hasCollision = params.hasCollision;
        this.isMoving = params.isMoving;
        this.isInFinalPosition = params.isInFinalPosition;
        this.isInStartPosition = params.isInStartPosition;
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
    getSpriteFromObstacle(obstacle, angle) {
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
        let spriteAngle = -angle;
        coordinates.x1 = middleVertex.x + (TILE_SIZE / 2) * Math.cos(spriteAngle);
        coordinates.y1 = middleVertex.y + (TILE_SIZE / 2) * Math.sin(spriteAngle);
        coordinates.x2 = middleVertex.x - (TILE_SIZE / 2) * Math.cos(spriteAngle);
        coordinates.y2 = middleVertex.y - (TILE_SIZE / 2) * Math.sin(spriteAngle);
        return {
            position: coordinates,
            type: INTERSECTION_TYPES.HORIZONTAL,
            shouldReverseTexture: true,
            textureId: obstacle.textureId,
            isMovable: false,
            isSprite: true,
            isVisible: true,
            isItem: obstacle.isItem,
            hasCollision: obstacle.hasCollision,
            purpose: obstacle.purpose,
        };
    }
    getWallFromObstacle(obstacle, type, neighbor) {
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
            isMovable: obstacle.isMovable,
            isVisible: !obstacle.isSprite,
            isSprite: false,
            isItem: false,
            hasCollision: obstacle.hasCollision,
            purpose: null,
        };
    }
    getNeighbors(map) {
        const neighbors = {
            [OBSTACLE_SIDES.TOP]: null,
            [OBSTACLE_SIDES.LEFT]: null,
            [OBSTACLE_SIDES.BOTTOM]: null,
            [OBSTACLE_SIDES.RIGHT]: null,
        };
        Object.keys(neighbors).forEach((side, i) => {
            const offset = NEIGHBOR_OFFSET[side];
            const axisY = map[this.matrixCoordinates.y + (1 - (i % 2)) * offset];
            if (axisY) {
                const axisXValue = axisY[this.matrixCoordinates.x + (i % 2) * offset];
                if (axisXValue) {
                    const isDoor = typeof axisXValue.rawValue === 'number' && DOOR_IDS.includes(axisXValue.rawValue);
                    const isSecret = typeof axisXValue.rawValue === 'string';
                    neighbors[side] = {
                        isDoor,
                        isSecret,
                        isMovable: isDoor || isSecret,
                        number: typeof axisXValue.rawValue === 'number' ? axisXValue.rawValue : Number(axisXValue.rawValue.split('_')[0]),
                    };
                }
            }
        });
        return neighbors;
    }
}
class Ray {
    constructor(position, angle, cameraAngle) {
        this.angle = angle;
        this.cameraAngle = cameraAngle;
        this.move(position);
    }
    changeAngle(angle, cameraAngle) {
        this.cameraAngle = cameraAngle;
        this.angle = angle;
        this.move({ x: this.cameraPosition.x1, y: this.cameraPosition.y1 });
    }
    fixFishEye(distance) {
        return distance * Math.cos(this.angle - this.cameraAngle);
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
            x2: position.x + Math.sin(this.angle) * RAY_LENGTH,
            y2: position.y + Math.cos(this.angle) * RAY_LENGTH,
        };
    }
    vectorSize({ x, y }) {
        return Math.sqrt(x * x + y * y);
    }
    unitVector({ x, y }) {
        const magnitude = this.vectorSize({ x, y });
        return { x: x / magnitude, y: y / magnitude };
    }
    castDDA(gameMap) {
        const intersections = [];
        const directionVector = this.unitVector({
            x: this.cameraPosition.x2 - this.cameraPosition.x1,
            y: this.cameraPosition.y2 - this.cameraPosition.y1,
        });
        const currentPlayerPosition = {
            x: this.cameraPosition.x1 / TILE_SIZE,
            y: this.cameraPosition.y1 / TILE_SIZE,
        };
        const currentMapPosition = {
            x: Math.floor(this.cameraPosition.x1 / TILE_SIZE),
            y: Math.floor(this.cameraPosition.y1 / TILE_SIZE),
        };
        const stepLengthX = Math.abs(1 / directionVector.x);
        const stepLengthY = Math.abs(1 / directionVector.y);
        let rayLengthX;
        let rayLengthY;
        let stepX = 1;
        let stepY = 1;
        if (directionVector.x < 0) {
            stepX = -1;
            rayLengthX = (currentPlayerPosition.x - currentMapPosition.x) * stepLengthX;
        }
        else {
            rayLengthX = (currentMapPosition.x + 1 - currentPlayerPosition.x) * stepLengthX;
        }
        if (directionVector.y < 0) {
            stepY = -1;
            rayLengthY = (currentPlayerPosition.y - currentMapPosition.y) * stepLengthY;
        }
        else {
            rayLengthY = (currentMapPosition.y + 1 - currentPlayerPosition.y) * stepLengthY;
        }
        let intersectionOrigin = 'x';
        let distance = 0;
        while (distance < RAY_LENGTH / TILE_SIZE) {
            if (rayLengthX < rayLengthY) {
                currentMapPosition.x += stepX;
                distance = rayLengthX;
                rayLengthX += stepLengthX;
                intersectionOrigin = 'x';
            }
            else {
                currentMapPosition.y += stepY;
                distance = rayLengthY;
                rayLengthY += stepLengthY;
                intersectionOrigin = 'y';
            }
            if (currentMapPosition.x >= 0 &&
                currentMapPosition.x < 64 &&
                currentMapPosition.y >= 0 &&
                currentMapPosition.y < 64) {
                if (gameMap[currentMapPosition.y] && gameMap[currentMapPosition.y][currentMapPosition.x]) {
                    const intersectedObstacle = gameMap[currentMapPosition.y][currentMapPosition.x];
                    if (intersectedObstacle.isDoor || intersectedObstacle.isMoving) {
                        continue;
                    }
                    const intersectionPoint = {
                        x: currentPlayerPosition.x * TILE_SIZE + directionVector.x * distance * TILE_SIZE,
                        y: currentPlayerPosition.y * TILE_SIZE + directionVector.y * distance * TILE_SIZE,
                    };
                    intersectionPoint[intersectionOrigin] = Math.round(intersectionPoint[intersectionOrigin]);
                    intersections.push({
                        obstacle: intersectedObstacle,
                        distance: this.fixFishEye(distance * TILE_SIZE),
                        intersectionVertex: intersectionPoint,
                    });
                    if (intersectedObstacle.isSprite) {
                        continue;
                    }
                    return intersections;
                }
            }
        }
        return intersections;
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
                intersectionVertex: closestIntersection.vertex,
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
        this.parsedMap = [];
        this.currentlyMovingObstacles = [];
        this.screenData = {
            screenHeight: this.canvas.height,
            screenWidth: this.canvas.width,
        };
        const { obstacles, startPosition, doorsObstacles } = this.parseMap(map);
        this.obstacles = obstacles;
        this.doors = doorsObstacles;
        this.minimap = new Minimap(this.ctx, this.obstacles, this.map.length, this.map[0].length);
        this.textures = [];
        this.sprites = [];
        for (let i = 1; i < 39; i++) {
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
        this.actor = new Actor(this.ctx, this.screenData, startPosition);
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
        const nonGridPlanes = this.getNonGridPlanes();
        if (!IS_PAUSED) {
            this.moveObstacles();
            this.obstacles.forEach((obstacle) => {
                if (obstacle.closeTimeout) {
                    obstacle.closeTimeout.iterate();
                }
            });
        }
        const intersections = this.camera.getIntersections(this.parsedMap, nonGridPlanes);
        const sortedAndMergedIntersections = [...intersections].sort((a, b) => b.distance - a.distance);
        const chunk = {
            startIndex: 0,
            width: 0,
            isInitial: true,
            rays: [],
        };
        for (let i = 0; i < sortedAndMergedIntersections.length; i++) {
            const intersection = sortedAndMergedIntersections[i];
            const plane = intersection.plane;
            const index = intersection.index;
            if (chunk.isInitial) {
                chunk.rays.push(intersection);
                chunk.width = 1;
                chunk.startIndex = intersection.index;
                chunk.isInitial = false;
            }
            let textureOffsetX = this.getTextureOffset(intersection);
            const nextIntersection = sortedAndMergedIntersections[i + 1];
            const nextTextureOffset = nextIntersection && this.getTextureOffset(nextIntersection);
            const sameOrNextIndex = (nextIntersection === null || nextIntersection === void 0 ? void 0 : nextIntersection.index) === index || (nextIntersection === null || nextIntersection === void 0 ? void 0 : nextIntersection.index) === index + 1;
            const sameDistance = (nextIntersection === null || nextIntersection === void 0 ? void 0 : nextIntersection.distance) === intersection.distance;
            const sameTextureId = (nextIntersection === null || nextIntersection === void 0 ? void 0 : nextIntersection.plane.textureId) === plane.textureId;
            const sameTextureOffset = nextTextureOffset === textureOffsetX;
            if (sameOrNextIndex && sameDistance && sameTextureId && sameTextureOffset) {
                chunk.rays.push(nextIntersection);
                chunk.width += 1;
            }
            else {
                const isHorizontalIntersection = plane.type === INTERSECTION_TYPES.HORIZONTAL;
                textureOffsetX = this.getTextureOffset(chunk.rays[0]);
                const textureHeight = ((TILE_SIZE / intersection.distance) * (180 / FOV_DEGREES) * this.screenData.screenHeight) / 1.75;
                const texture = plane.isSprite
                    ? this.sprites[plane.textureId - 1]
                    : this.textures[plane.textureId - (isHorizontalIntersection ? 0 : 1)];
                const textureOffsetY = 0;
                const textureWidth = 1;
                const textureSize = TEXTURE_SIZE;
                const textureXPositionOnScreen = chunk.startIndex / RESOLUTION_SCALE;
                const textureYPositionOnScreen = this.screenData.screenHeight / 2 - textureHeight / 2;
                const textureWidthOnScreen = chunk.width / RESOLUTION_SCALE;
                chunk.rays = [];
                chunk.width = 0;
                chunk.startIndex = 0;
                chunk.isInitial = true;
                this.ctx.drawImage(texture, textureOffsetX, textureOffsetY, textureWidth, textureSize, textureXPositionOnScreen, textureYPositionOnScreen, textureWidthOnScreen, textureHeight);
            }
        }
        if (!IS_PAUSED) {
            this.actor.render();
            this.actor.move(this.parsedMap);
        }
        this.minimap.render(this.actor.position, this.camera.angle);
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
            ? coordinatesToCompareWith.x - intersection.intersectionVertex.x
            : coordinatesToCompareWith.y - intersection.intersectionVertex.y;
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
    getNonGridPlanes() {
        const position = this.actor.position;
        const angle = this.camera.angle;
        const leftExtremumAngle = angle - FOV;
        const rightExtremumAngle = angle + FOV;
        const currentAngleRayEndVertex = this.getVertexByPositionAndAngle(position, angle);
        const leftFOVExtremumVertex = this.getVertexByPositionAndAngle(currentAngleRayEndVertex, leftExtremumAngle);
        const rightFOVExtremumVertex = this.getVertexByPositionAndAngle(currentAngleRayEndVertex, rightExtremumAngle);
        const rangeBoundaries = {
            x1: position.x,
            y1: position.y,
            x2: leftFOVExtremumVertex.x,
            y2: leftFOVExtremumVertex.y,
            x3: rightFOVExtremumVertex.x,
            y3: rightFOVExtremumVertex.y,
        };
        const nonGridObstacles = [...this.currentlyMovingObstacles, ...this.doors];
        const planes = nonGridObstacles.reduce((acc, obstacle) => {
            const obstaclePos = obstacle.position;
            if (obstacle.isDoor) {
                const type = obstacle.isVertical ? OBSTACLE_SIDES.TOP : OBSTACLE_SIDES.LEFT;
                acc.push(obstacle.getWallFromObstacle(obstacle, type, null));
                return acc;
            }
            if (position.x <= obstaclePos.x1) {
                acc.push(obstacle.getWallFromObstacle(obstacle, OBSTACLE_SIDES.LEFT, null));
            }
            if (position.x >= obstaclePos.x2) {
                acc.push(obstacle.getWallFromObstacle(obstacle, OBSTACLE_SIDES.RIGHT, null));
            }
            if (position.y <= obstaclePos.y1) {
                acc.push(obstacle.getWallFromObstacle(obstacle, OBSTACLE_SIDES.TOP, null));
            }
            if (position.y >= obstaclePos.y2) {
                acc.push(obstacle.getWallFromObstacle(obstacle, OBSTACLE_SIDES.BOTTOM, null));
            }
            return acc;
        }, []);
        return planes.filter((plane) => {
            const isLookingAt = !!this.camera.getViewAngleIntersection(plane.position);
            const { x1, y1, x2, y2 } = plane.position;
            return (isLookingAt ||
                this.getIsVertexInTheTriangle({ x: x1, y: y1 }, rangeBoundaries) ||
                this.getIsVertexInTheTriangle({ x: x2, y: y2 }, rangeBoundaries));
        });
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
        this.currentlyMovingObstacles.forEach((obstacle) => {
            obstacle.isMoving = true;
            const finalPosition = obstacle.isInStartPosition ? obstacle.endPosition : obstacle.initialPosition;
            const matrixCoordinates = obstacle.matrixCoordinates;
            obstacle.position = {
                x1: obstacle.position.x1 + this.getPositionChange(obstacle.position.x1, finalPosition.x1),
                y1: obstacle.position.y1 + this.getPositionChange(obstacle.position.y1, finalPosition.y1),
                x2: obstacle.position.x2 + this.getPositionChange(obstacle.position.x2, finalPosition.x2),
                y2: obstacle.position.y2 + this.getPositionChange(obstacle.position.y2, finalPosition.y2),
            };
            if (obstacle.position.x1 === finalPosition.x1 &&
                obstacle.position.y1 === finalPosition.y1 &&
                obstacle.position.x2 === finalPosition.x2 &&
                obstacle.position.y2 === finalPosition.y2) {
                let endPositionMatrixCoordinates = {
                    y: Math.floor(finalPosition.y1 / TILE_SIZE),
                    x: Math.floor(finalPosition.x1 / TILE_SIZE),
                };
                if (!obstacle.isDoor) {
                    this.parsedMap[endPositionMatrixCoordinates.y][endPositionMatrixCoordinates.x] = obstacle;
                    this.parsedMap[matrixCoordinates.y][matrixCoordinates.x] = null;
                }
                obstacle.isMoving = false;
                obstacle.isInStartPosition = !obstacle.isInStartPosition;
                obstacle.isInFinalPosition = !obstacle.isInFinalPosition;
                obstacle.matrixCoordinates = endPositionMatrixCoordinates;
                if (obstacle.isDoor && !obstacle.isInStartPosition) {
                    obstacle.closeTimeout = new Timeout(() => {
                        const actorMatrixPosition = this.actor.currentMatrixPosition;
                        if (actorMatrixPosition.x >= matrixCoordinates.x - 1 &&
                            actorMatrixPosition.x <= matrixCoordinates.x + 1 &&
                            actorMatrixPosition.y >= matrixCoordinates.y - 1 &&
                            actorMatrixPosition.y <= matrixCoordinates.y + 1) {
                            obstacle.closeTimeout.set(DOOR_TIMEOUT);
                            return;
                        }
                        this.currentlyMovingObstacles.push(obstacle);
                        obstacle.isMoving = true;
                        obstacle.closeTimeout = null;
                        obstacle.hasCollision = true;
                        obstacle.matrixCoordinates = matrixCoordinates;
                    });
                    obstacle.hasCollision = false;
                    obstacle.closeTimeout.set(DOOR_TIMEOUT);
                }
                this.currentlyMovingObstacles = this.currentlyMovingObstacles.filter((currentObstacle) => currentObstacle !== obstacle);
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
                if (this.currentlyMovingObstacles.includes(obstacle)) {
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
            this.currentlyMovingObstacles.push(obstacleInView);
        }
    }
    parseMap(map) {
        const obstacles = [];
        const doorsObstacles = [];
        let startPosition = { x: 0, y: 0 };
        let secretObstaclesEndPositions = {};
        for (let i = 0; i < map.length; i++) {
            this.parsedMap.push([]);
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
                        startPosition = { x: j * TILE_SIZE + TILE_SIZE / 2, y: i * TILE_SIZE + TILE_SIZE / 2 };
                        this.parsedMap[i].push(null);
                        continue;
                    }
                    const obstacleParams = typeof value === 'number' ? [] : value.split('_');
                    const textureId = typeof value !== 'number' ? Number(obstacleParams[0]) : value;
                    if (obstacleParams && obstacleParams.includes('END')) {
                        this.parsedMap[i].push(null);
                        continue;
                    }
                    const nextToVoid = j % 63 === 0 || i % 63 === 0;
                    const isItem = obstacleParams.includes('ITEM');
                    const isSprite = obstacleParams.includes('SPRITE') || false;
                    const isSecret = !isSprite && obstacleParams.includes('START');
                    const isDoor = !isSprite && DOOR_IDS.includes(textureId);
                    const isMovable = !isSprite && (isDoor || isSecret) && !nextToVoid;
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
                    const preparedObstacle = new Obstacle({
                        matrixCoordinates: { y: Math.floor(position.y1 / TILE_SIZE), x: Math.floor(position.x1 / TILE_SIZE) },
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
                        isInFinalPosition: false,
                        isInStartPosition: true,
                        isMovable,
                        isMoving: false,
                        isVertical,
                        isSprite,
                        hasCollision,
                        isItem,
                        textureId,
                        rawValue: value,
                        closeTimeout: null,
                        purpose,
                    });
                    if (preparedObstacle.isDoor) {
                        doorsObstacles.push(preparedObstacle);
                    }
                    this.parsedMap[i].push(preparedObstacle);
                    obstacles.push(preparedObstacle);
                }
                else {
                    this.parsedMap[i].push(null);
                }
            }
        }
        return { obstacles, startPosition, doorsObstacles };
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