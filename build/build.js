var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const map = [
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
let RESOLUTION_SCALE = 1;
let IS_PAUSED = false;
const RAY_LENGTH = 5000;
const CELL_SIZE = 10;
const ACTOR_SPEED = 1;
const ACTOR_START_POSITION = { x: CELL_SIZE * 1.5, y: CELL_SIZE * 1.5 };
const DOOR_IDS = [27, 28];
const FOV_DEGREES = 75;
const FOV = (FOV_DEGREES * Math.PI) / 180;
const OBSTACLES_MOVE_SPEED = CELL_SIZE / (CELL_SIZE * 4);
const TEXTURE_SIZE = 64;
const TEXTURE_SCALE = TEXTURE_SIZE / CELL_SIZE;
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
    [OBSTACLE_SIDES.TOP]: -CELL_SIZE,
    [OBSTACLE_SIDES.BOTTOM]: CELL_SIZE,
    [OBSTACLE_SIDES.LEFT]: -CELL_SIZE,
    [OBSTACLE_SIDES.RIGHT]: CELL_SIZE,
};
const canvas = document.getElementById('canvas');
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const menu = document.getElementById('menu-container');
        const resolutionScaleRange = document.getElementById('resolution-scale');
        const continueButton = document.getElementById('continue-button');
        continueButton.onclick = () => {
            if (IS_PAUSED) {
                IS_PAUSED = false;
                menu.style.display = 'none';
            }
        };
        resolutionScaleRange.value = String(RESOLUTION_SCALE);
        resolutionScaleRange.onchange = (event) => {
            if (event.target) {
                RESOLUTION_SCALE = Number(event.target.value);
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
const WEAPONS = {
    KNIFE: {
        maxDistance: 10,
        damage: 10,
        speed: 10,
        ammoPerAttack: 0,
        icon: '',
    },
    PISTOL: {
        maxDistance: 70,
        damage: 40,
        speed: 10,
        ammoPerAttack: 1,
        icon: '',
    },
    MACHINE_GUN: {
        maxDistance: 70,
        damage: 20,
        speed: 30,
        ammoPerAttack: 1,
        icon: '',
    },
};
class Actor {
    constructor(ctx, obstacles, obstaclesVectorsByPurposes, screenData) {
        this.ammo = 10;
        this.ctx = ctx;
        this.currentWeapon = 'KNIFE';
        this.currentlyMovingObstacles = [];
        this.health = 100;
        this.horizontalSpeed = 0;
        this.lifes = 1;
        this.obstacles = obstacles;
        this.obstaclesVectorsByPurposes = obstaclesVectorsByPurposes;
        this.position = ACTOR_START_POSITION;
        this.screenData = screenData;
        this.verticalSpeed = 0;
        this.weapons = ['KNIFE', 'PISTOL'];
        this.camera = new Camera(ACTOR_START_POSITION, this.screenData.screenWidth * RESOLUTION_SCALE, this.ctx, this.obstaclesVectorsByPurposes.walls, this.obstaclesVectorsByPurposes.sprites);
        window.addEventListener('keydown', this.handleKeyDown.bind(this));
        window.addEventListener('keyup', this.handleKeyUp.bind(this));
    }
    updateObstaclesVectorsByPurposes(obstacleVectorsByPurposes) {
        this.obstaclesVectorsByPurposes = obstacleVectorsByPurposes;
        this.camera.updateObstacles(obstacleVectorsByPurposes.walls, obstacleVectorsByPurposes.sprites);
    }
    updateObstacles(obstacles) {
        this.obstacles = obstacles;
    }
    handleKeyDown(event) {
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
    handleKeyUp(event) {
        if (event.keyCode === 87 || event.keyCode === 83) {
            this.verticalSpeed = 0;
        }
        else if (event.keyCode === 68 || event.keyCode === 65) {
            this.horizontalSpeed = 0;
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
        for (let wall of this.obstaclesVectorsByPurposes.collisionObstacles) {
            const wallObstacle = this.obstacles[Number(wall.obstacleIdx)];
            if (this.position.y >= wall.position.y1 &&
                this.position.y <= wall.position.y2 &&
                ((position.x >= wall.position.x1 && this.position.x <= wall.position.x1) ||
                    (position.x <= wall.position.x1 && this.position.x >= wall.position.x1))) {
                position.x = this.position.x;
            }
            if (this.position.x >= wall.position.x1 &&
                this.position.x <= wall.position.x2 &&
                ((position.y >= wall.position.y1 && this.position.y <= wall.position.y1) ||
                    (position.y <= wall.position.y1 && this.position.y >= wall.position.y1))) {
                position.y = this.position.y;
            }
            if (position.x >= wallObstacle.position.x1 &&
                position.x <= wallObstacle.position.x2 &&
                position.y >= wallObstacle.position.y1 &&
                position.y <= wallObstacle.position.y2) {
                position.y = this.position.y;
                position.x = this.position.x;
            }
        }
        this.position = position;
        this.camera.updatePosition(this.position);
    }
    render() { }
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
        return Ray.getIntersectionVertexWithWall({
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
            wallsIntersections.push(Object.assign(Object.assign({}, wallsIntersection), { index: i }));
            const spritesIntersection = this.rays[i].cast(this.sprites);
            spritesIntersections.push(Object.assign(Object.assign({}, spritesIntersection), { index: i }));
        }
        return {
            walls: wallsIntersections,
            sprites: spritesIntersections,
        };
    }
    changeRaysAmount(raysAmount) {
        this.rays = [];
        const initialAngle = this.angle - FOV / 2;
        const step = FOV / raysAmount / RESOLUTION_SCALE;
        for (let i = 0; i < raysAmount * RESOLUTION_SCALE; i++) {
            this.rays.push(new Ray(this.position, initialAngle + i * step, this.angle));
        }
    }
    rotate(event) {
        this.angle += this.toRadians(event.movementX / 3);
        this.angle = this.angle % (2 * Math.PI);
        const initialAngle = this.angle - FOV / 2;
        const step = FOV / this.rays.length;
        for (let i = 0; i < this.rays.length; i++) {
            this.rays[i].changeAngle(initialAngle + i * step, this.angle);
        }
    }
}
class Minimap {
    constructor(ctx, obstacles) {
        this.ctx = ctx;
        this.obstacles = obstacles;
    }
    render(position, intersections) {
        this.ctx.strokeStyle = 'orange';
        this.ctx.beginPath();
        for (let i = 0; i < intersections.length; i++) {
            const intersection = intersections[i];
            if (intersection.distance === RAY_LENGTH || intersection.wall.isSprite) {
                continue;
            }
            this.ctx.moveTo(position.x, position.y);
            this.ctx.lineTo(intersection.x, intersection.y);
        }
        this.ctx.closePath();
        this.ctx.stroke();
        this.ctx.fillStyle = 'white';
        for (let obstacle of this.obstacles) {
            if (!obstacle.isDoor && !obstacle.isSprite) {
                this.ctx.fillRect(obstacle.position.x1, obstacle.position.y1, CELL_SIZE, CELL_SIZE);
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
    static getIntersectionVertexWithWall(firstVector, secondVector) {
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
    getDistance(wall) {
        return Math.sqrt((wall.x - this.cameraPosition.x1) ** 2 + (wall.y - this.cameraPosition.y1) ** 2);
    }
    move(position) {
        this.cameraPosition = {
            x1: position.x,
            y1: position.y,
            x2: position.x + Math.sin(this.rayAngle) * RAY_LENGTH,
            y2: position.y + Math.cos(this.rayAngle) * RAY_LENGTH,
        };
    }
    cast(walls) {
        let intersections = [];
        for (let wall of walls) {
            const intersection = Ray.getIntersectionVertexWithWall(this.cameraPosition, wall.position);
            if (intersection) {
                intersections.push({
                    vertex: intersection,
                    wall,
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
                wall: closestIntersection.wall,
                distance: this.fixFishEye(closestDistance),
            };
        }
        return {
            x: this.cameraPosition.x2,
            y: this.cameraPosition.y2,
            wall: {
                position: { x1: 0, y1: 0, x2: 0, y2: 0 },
                obstacleIdx: 1,
                type: INTERSECTION_TYPES.VERTICAL,
                isMovable: false,
                shouldReverseTexture: false,
                isVisible: false,
                textureId: 1,
                isSprite: false,
            },
            distance: RAY_LENGTH,
        };
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
        this.obstacles = this.generateObstaclesFromMap(map);
        this.minimap = new Minimap(this.ctx, this.obstacles);
        this.textures = [];
        this.sprites = [];
        for (let i = 1; i < 31; i++) {
            const image = new Image();
            image.src = `src/textures/${i}.png`;
            this.textures.push(image);
        }
        for (let i = 1; i < 2; i++) {
            const image = new Image();
            image.src = `src/sprites/${i}.png`;
            this.sprites.push(image);
        }
        this.actor = new Actor(this.ctx, this.obstacles, { walls: [], sprites: [], collisionObstacles: [] }, this.screenData);
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
        const vectorsByPurposes = this.getObstaclesVectorsByPurposes();
        if (!IS_PAUSED) {
            this.moveObstacles();
        }
        this.actor.updateObstacles(this.obstacles);
        this.actor.updateObstaclesVectorsByPurposes(vectorsByPurposes);
        if (!IS_PAUSED) {
            this.actor.move();
        }
        const intersections = this.camera.getIntersections();
        const sortedAndMergedIntersections = [...intersections.walls, ...intersections.sprites].sort((a, b) => b.distance - a.distance);
        for (let i = 0; i < sortedAndMergedIntersections.length; i++) {
            const intersection = sortedAndMergedIntersections[i];
            const wall = intersection.wall;
            const index = intersection.index;
            const isVerticalIntersection = wall.type === INTERSECTION_TYPES.VERTICAL;
            const textureOffsetX = this.getTextureOffset(intersection);
            const textureHeight = ((CELL_SIZE / intersection.distance) * (180 / FOV_DEGREES) * this.screenData.screenHeight) / 1.75;
            const texture = wall.isSprite
                ? this.sprites[wall.textureId - 1]
                : this.textures[wall.textureId - (isVerticalIntersection ? 0 : 1)];
            const textureOffsetY = 0;
            const textureWidth = 1;
            const textureSize = TEXTURE_SIZE;
            const textureXPositionOnScreen = index / RESOLUTION_SCALE;
            const textureYPositionOnScreen = this.screenData.screenHeight / 2 - textureHeight / 2;
            const textureWidthOnScreen = Math.ceil(1 / RESOLUTION_SCALE);
            if (intersection.distance !== RAY_LENGTH) {
                this.ctx.drawImage(texture, textureOffsetX, textureOffsetY, textureWidth, textureSize, textureXPositionOnScreen, textureYPositionOnScreen, textureWidthOnScreen, textureHeight);
            }
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
        const wall = intersection.wall;
        const position = wall.position;
        const isVerticalIntersection = wall.type === INTERSECTION_TYPES.VERTICAL;
        let isInverse = false;
        if (wall.isSprite) {
            if (Math.abs(position.x1 - position.x2) > Math.abs(position.y1 - position.y2)) {
                isInverse = true;
            }
        }
        const coordinatesToCompareWith = wall.shouldReverseTexture
            ? { x: position.x2, y: position.y2 }
            : { x: position.x1, y: position.y1 };
        const fromWallStartToIntersectionWidth = isVerticalIntersection || isInverse
            ? coordinatesToCompareWith.x - intersection.x
            : coordinatesToCompareWith.y - intersection.y;
        const wallLength = isVerticalIntersection || isInverse ? Math.abs(position.x1 - position.x2) : Math.abs(position.y1 - position.y2);
        const textureDistanceFromStartCoefficient = Math.abs(fromWallStartToIntersectionWidth) / wallLength;
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
    getWallVectorFromObstacle(obstacle, wallPosition) {
        const obstaclePos = obstacle.position;
        const isDoor = obstacle.isDoor;
        return {
            x1: obstaclePos.x1 + (wallPosition === OBSTACLE_SIDES.RIGHT && !isDoor ? CELL_SIZE : 0),
            y1: obstaclePos.y1 + (wallPosition === OBSTACLE_SIDES.BOTTOM && !isDoor ? CELL_SIZE : 0),
            x2: obstaclePos.x2 - (wallPosition === OBSTACLE_SIDES.LEFT && !isDoor ? CELL_SIZE : 0),
            y2: obstaclePos.y2 - (wallPosition === OBSTACLE_SIDES.TOP && !isDoor ? CELL_SIZE : 0),
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
        coordinates.x1 = middleVertex.x + (CELL_SIZE / 2) * Math.cos(spriteAngle);
        coordinates.y1 = middleVertex.y + (CELL_SIZE / 2) * Math.sin(spriteAngle);
        coordinates.x2 = middleVertex.x - (CELL_SIZE / 2) * Math.cos(spriteAngle);
        coordinates.y2 = middleVertex.y - (CELL_SIZE / 2) * Math.sin(spriteAngle);
        return {
            position: coordinates,
            type: INTERSECTION_TYPES.HORIZONTAL,
            shouldReverseTexture: true,
            textureId: obstacle.textureId,
            obstacleIdx: index,
            isMovable: false,
            isSprite: true,
            isVisible: true,
        };
    }
    getWallFromObstacle(obstacle, index, type, neighbor) {
        const isVertical = type === OBSTACLE_SIDES.TOP || type === OBSTACLE_SIDES.BOTTOM;
        let textureId = obstacle.textureId;
        if (neighbor === null || neighbor === void 0 ? void 0 : neighbor.isDoor) {
            textureId = isVertical ? 29 : 30;
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
            const axisY = this.map[(obstacle.y1 + (i % 2 === 0 ? offset : 0)) / CELL_SIZE];
            if (axisY) {
                const axisXValue = axisY[(obstacle.x1 + (i % 2 === 0 ? 0 : offset)) / CELL_SIZE];
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
    getObstaclesVectorsByPurposes() {
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
        const vectors = this.obstacles.reduce((acc, obstacle, i) => {
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
        const vectorsByLength = vectors.filter((vector) => vector.position.y1 >= lengthBoundaries.y1 &&
            vector.position.x1 >= lengthBoundaries.x1 &&
            vector.position.x2 <= lengthBoundaries.x2 &&
            vector.position.y2 <= lengthBoundaries.y2);
        const vectorsByRange = vectors.filter((vector) => {
            const isLookingAt = !!this.camera.getViewAngleIntersection(vector.position);
            const { x1, y1, x2, y2 } = vector.position;
            return (isLookingAt ||
                this.getIsVertexInTheTriangle({ x: x1, y: y1 }, rangeBoundaries) ||
                this.getIsVertexInTheTriangle({ x: x2, y: y2 }, rangeBoundaries));
        });
        const vectorsByCameraVertexIntersections = vectorsByRange.filter((vectorByRange) => {
            if (!vectorByRange.isVisible) {
                return false;
            }
            return !vectorsByRange.some((innerVectorByRange) => {
                return [
                    { x1: vectorByRange.position.x1, y1: vectorByRange.position.y1, x2: position.x, y2: position.y },
                    { x1: vectorByRange.position.x2, y1: vectorByRange.position.y2, x2: position.x, y2: position.y },
                ].every((vector) => {
                    if (innerVectorByRange === vectorByRange || !innerVectorByRange.isVisible || innerVectorByRange.isSprite) {
                        return false;
                    }
                    return !!Ray.getIntersectionVertexWithWall(vector, innerVectorByRange.position);
                });
            });
        });
        const walls = [];
        const sprites = [];
        vectorsByCameraVertexIntersections.forEach(vector => {
            if (vector.isSprite) {
                sprites.push(vector);
            }
            else {
                walls.push(vector);
            }
        });
        return {
            collisionObstacles: vectorsByLength,
            walls,
            sprites,
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
            this.obstacles[Number(key)].position = {
                x1: obstacle.position.x1 + this.getPositionChange(obstacle.position.x1, obstacle.endPosition.x1),
                y1: obstacle.position.y1 + this.getPositionChange(obstacle.position.y1, obstacle.endPosition.y1),
                x2: obstacle.position.x2 + this.getPositionChange(obstacle.position.x2, obstacle.endPosition.x2),
                y2: obstacle.position.y2 + this.getPositionChange(obstacle.position.y2, obstacle.endPosition.y2),
            };
            if (obstacle.position.x1 === obstacle.endPosition.x1 &&
                obstacle.position.y1 === obstacle.endPosition.y1 &&
                obstacle.position.x2 === obstacle.endPosition.x2 &&
                obstacle.position.y2 === obstacle.endPosition.y2) {
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
                if (!obstacle.isDoor && !obstacle.isSecret) {
                    continue;
                }
                const intersection = this.camera.getViewAngleIntersection(obstacle.position);
                const distance = Math.sqrt((this.actor.position.x - obstacle.position.x1) ** 2 + (this.actor.position.y - obstacle.position.y1) ** 2);
                if (intersection && distance <= CELL_SIZE * 2) {
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
    generateObstaclesFromMap(map) {
        const obstacles = [];
        let secretWallsEndPositions = {};
        for (let i = 0; i < map.length; i++) {
            for (let j = 0; j < map[i].length; j++) {
                const value = map[i][j];
                if (value && typeof value === 'string') {
                    const params = value.split('_');
                    if (params[2] === 'END') {
                        secretWallsEndPositions[params[1]] = {
                            x1: j * CELL_SIZE,
                            y1: i * CELL_SIZE,
                            x2: j * CELL_SIZE + CELL_SIZE,
                            y2: i * CELL_SIZE + CELL_SIZE,
                        };
                    }
                }
            }
        }
        for (let i = 0; i < map.length; i++) {
            for (let j = 0; j < map[i].length; j++) {
                const value = map[i][j];
                if (value) {
                    const obstacleParams = typeof value === 'number' ? null : value.split('_');
                    const valueNumber = obstacleParams ? Number(obstacleParams[0]) : value;
                    if (obstacleParams && obstacleParams[2] === 'END') {
                        continue;
                    }
                    const isSecret = !!(obstacleParams && obstacleParams[2] === 'START');
                    const isDoor = DOOR_IDS.includes(valueNumber);
                    const isSprite = (obstacleParams && obstacleParams[1] === 'SPRITE') || false;
                    const isVertical = !!(map[i][j - 1] && map[i][j + 1]);
                    const position = {
                        x1: j * CELL_SIZE + (!isVertical && isDoor ? CELL_SIZE * 0.5 : 0),
                        y1: i * CELL_SIZE + (isVertical && isDoor ? CELL_SIZE * 0.5 : 0),
                        x2: j * CELL_SIZE + (!isVertical && isDoor ? CELL_SIZE * 0.5 : CELL_SIZE),
                        y2: i * CELL_SIZE + (isVertical && isDoor ? CELL_SIZE * 0.5 : CELL_SIZE),
                    };
                    obstacles.push({
                        position,
                        endPosition: isSecret && obstacleParams
                            ? secretWallsEndPositions[obstacleParams[1]]
                            : {
                                x1: isVertical ? position.x1 + CELL_SIZE : position.x1,
                                y1: !isVertical ? position.y1 - CELL_SIZE : position.y1,
                                x2: isVertical ? position.x2 + CELL_SIZE : position.x2,
                                y2: !isVertical ? position.y2 - CELL_SIZE : position.y2,
                            },
                        isDoor,
                        isSecret,
                        isMovable: isSecret || isDoor,
                        isVertical,
                        isSprite,
                        textureId: valueNumber,
                    });
                }
            }
        }
        return obstacles;
    }
}
//# sourceMappingURL=build.js.map