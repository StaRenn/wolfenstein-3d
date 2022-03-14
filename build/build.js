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
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];
const CAMERA_SPEED = 2;
const FOV_DEGREES = 75;
const FOV = (FOV_DEGREES * Math.PI) / 180;
const CELL_SIZE = 10;
const TEXTURE_SIZE = 64;
const TEXTURE_SCALE = TEXTURE_SIZE / CELL_SIZE;
const CAMERA_START_POSITION = { x: CELL_SIZE * 1.5, y: CELL_SIZE * 1.5 };
const RAY_LENGTH = 400;
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
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const canvas = document.getElementById('canvas');
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
        function frame() {
            scene.render();
            requestAnimationFrame(frame);
        }
        frame();
    });
}
window.onload = main;
class Camera {
    constructor(position, raysAmount, ctx, obstacles) {
        this.angle = this.toRadians(60);
        this.speed = 0;
        this.ctx = ctx;
        this.obstacles = obstacles;
        this.position = position;
        window.addEventListener('keydown', this.handleKeyDown.bind(this));
        window.addEventListener('keyup', this.handleKeyUp.bind(this));
        window.addEventListener('mousemove', this.rotate.bind(this));
        this.changeRaysAmount(raysAmount);
    }
    handleKeyDown(event) {
        if (event.key === 'w') {
            this.speed = CAMERA_SPEED;
        }
        else if (event.key === 's') {
            this.speed = -CAMERA_SPEED;
        }
    }
    handleKeyUp(event) {
        if (event.key === 'w' || event.key === 's') {
            this.speed = 0;
        }
    }
    toRadians(angle) {
        return (angle * Math.PI) / 180;
    }
    getAreaSize(x1, y1, x2, y2, x3, y3) {
        return Math.abs((x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)) / 2.0);
    }
    getIsVertexInTheTriangle({ x, y }, { x1, y1, x2, y2, x3, y3 }) {
        let A = this.getAreaSize(x1, y1, x2, y2, x3, y3);
        let A1 = this.getAreaSize(x, y, x2, y2, x3, y3);
        let A2 = this.getAreaSize(x1, y1, x, y, x3, y3);
        let A3 = this.getAreaSize(x1, y1, x2, y2, x, y);
        return Math.round(A) == Math.round(A1 + A2 + A3);
    }
    getVertexByPositionAndAngle(position, angle) {
        return {
            x: position.x + RAY_LENGTH * Math.sin(angle),
            y: position.y + RAY_LENGTH * Math.cos(angle),
        };
    }
    getWallVectorFromObstacle(obstacle, wallPosition) {
        return {
            x1: obstacle.x1 + (wallPosition === OBSTACLE_SIDES.RIGHT ? CELL_SIZE : 0),
            y1: obstacle.y1 + (wallPosition === OBSTACLE_SIDES.BOTTOM ? CELL_SIZE : 0),
            x2: obstacle.x2 - (wallPosition === OBSTACLE_SIDES.LEFT ? CELL_SIZE : 0),
            y2: obstacle.y2 - (wallPosition === OBSTACLE_SIDES.TOP ? CELL_SIZE : 0),
        };
    }
    getWallFromObstacle(obstacle, type) {
        const isVertical = type === OBSTACLE_SIDES.TOP || type === OBSTACLE_SIDES.BOTTOM;
        return {
            position: this.getWallVectorFromObstacle(obstacle, type),
            type: isVertical ? INTERSECTION_TYPES.VERTICAL : INTERSECTION_TYPES.HORIZONTAL,
            shouldReverseTexture: type === OBSTACLE_SIDES.LEFT || type === OBSTACLE_SIDES.BOTTOM
        };
    }
    getVisibleObstacles() {
        const leftExtremumAngle = this.angle - FOV;
        const rightExtremumAngle = this.angle + FOV;
        const currentAngleRayEndVertex = this.getVertexByPositionAndAngle(this.position, this.angle);
        const leftFOVExtremumVertex = this.getVertexByPositionAndAngle(currentAngleRayEndVertex, leftExtremumAngle);
        const rightFOVExtremumVertex = this.getVertexByPositionAndAngle(currentAngleRayEndVertex, rightExtremumAngle);
        const lengthBoundaries = {
            x1: this.position.x - RAY_LENGTH,
            y1: this.position.y - RAY_LENGTH,
            x2: this.position.x + RAY_LENGTH,
            y2: this.position.y + RAY_LENGTH,
        };
        const rangeBoundaries = {
            x1: this.position.x,
            y1: this.position.y,
            x2: leftFOVExtremumVertex.x,
            y2: leftFOVExtremumVertex.y,
            x3: rightFOVExtremumVertex.x,
            y3: rightFOVExtremumVertex.y,
        };
        const visibleWalls = this.obstacles.reduce((acc, obstacle) => {
            if (this.position.x <= obstacle.x1) {
                acc.push(this.getWallFromObstacle(obstacle, OBSTACLE_SIDES.LEFT));
            }
            if (this.position.x >= obstacle.x2) {
                acc.push(this.getWallFromObstacle(obstacle, OBSTACLE_SIDES.RIGHT));
            }
            if (this.position.y <= obstacle.y1) {
                acc.push(this.getWallFromObstacle(obstacle, OBSTACLE_SIDES.TOP));
            }
            if (this.position.y >= obstacle.y2) {
                acc.push(this.getWallFromObstacle(obstacle, OBSTACLE_SIDES.BOTTOM));
            }
            return acc;
        }, []);
        const visibleWallsByRange = visibleWalls.filter((wall) => {
            const isLookingAt = Ray.getIntersectionVertexWithWall({
                x1: this.position.x,
                y1: this.position.y,
                x2: currentAngleRayEndVertex.x,
                y2: currentAngleRayEndVertex.y,
            }, wall);
            const { x1, y1, x2, y2 } = wall.position;
            return (isLookingAt ||
                this.getIsVertexInTheTriangle({ x: x1, y: y1 }, rangeBoundaries) ||
                this.getIsVertexInTheTriangle({ x: x2, y: y2 }, rangeBoundaries));
        });
        const visibleWallsByLength = visibleWallsByRange.filter((wall) => wall.position.y1 >= lengthBoundaries.y1 &&
            wall.position.x1 >= lengthBoundaries.x1 &&
            wall.position.x2 <= lengthBoundaries.x2 &&
            wall.position.y2 <= lengthBoundaries.y2);
        return visibleWallsByLength;
    }
    move() {
        if (this.speed === 0) {
            return;
        }
        const position = { x: this.position.x, y: this.position.y };
        position.x += Math.sin(this.angle) * this.speed;
        position.y += Math.cos(this.angle) * this.speed;
        for (let obstacle of this.obstacles) {
            if (position.y >= obstacle.y1 &&
                position.y <= obstacle.y2 &&
                position.x >= obstacle.x1 &&
                position.x <= obstacle.x2) {
                position.x = this.position.x;
                position.y = this.position.y;
            }
        }
        for (let i = 0; i < this.rays.length; i++) {
            this.rays[i].move(position);
        }
        this.position = position;
    }
    renderAndGetIntersections() {
        this.move();
        let intersections = [];
        this.ctx.strokeStyle = 'orange';
        this.ctx.beginPath();
        const visibleObstacles = this.getVisibleObstacles();
        for (let ray of this.rays) {
            const intersection = ray.cast(visibleObstacles);
            intersections.push(intersection);
            this.ctx.moveTo(this.position.x, this.position.y);
            this.ctx.lineTo(intersection.x, intersection.y);
        }
        this.ctx.closePath();
        this.ctx.stroke();
        return intersections;
    }
    changeRaysAmount(raysAmount) {
        this.rays = [];
        const initialAngle = this.angle - FOV / 2;
        const step = FOV / raysAmount;
        for (let i = 0; i < raysAmount; i++) {
            this.rays.push(new Ray(this.position, initialAngle + i * step, this.angle));
        }
    }
    rotate(event) {
        this.angle += this.toRadians(event.movementX);
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
        this.walls = obstacles;
    }
    render() {
        this.ctx.fillStyle = 'white';
        for (let wall of this.walls) {
            this.ctx.fillRect(wall.x1, wall.y1, CELL_SIZE, CELL_SIZE);
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
    static getIntersectionVertexWithWall(vector, wall) {
        const { x1, x2, y1, y2 } = vector;
        const { x1: x3, y1: y3, x2: x4, y2: y4 } = wall.position;
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
        return Math.sqrt(Math.pow((wall.x - this.cameraPosition.x1), 2) + Math.pow((wall.y - this.cameraPosition.y1), 2));
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
            const intersection = Ray.getIntersectionVertexWithWall(this.cameraPosition, wall);
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
                type: closestIntersection.wall.type,
                shouldReverseTexture: closestIntersection.wall.shouldReverseTexture,
                distance: this.fixFishEye(closestDistance),
            };
        }
        return {
            x: this.cameraPosition.x2,
            y: this.cameraPosition.y2,
            type: INTERSECTION_TYPES.VERTICAL,
            shouldReverseTexture: false,
            distance: RAY_LENGTH,
        };
    }
}
class Scene {
    constructor(canvas, map) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.map = map;
        this.screenHeight = this.canvas.height;
        this.screenWidth = this.canvas.width;
        this.obstacles = this.generateObstaclesFromMap(map);
        const image = document.createElement('img');
        image.src = 'src/textures/textures.png';
        this.textures = image;
        this.camera = new Camera(CAMERA_START_POSITION, this.screenWidth, this.ctx, this.obstacles);
        this.minimap = new Minimap(this.ctx, this.obstacles);
    }
    render() {
        this.ctx.globalCompositeOperation = 'destination-over';
        this.ctx.beginPath();
        this.ctx.clearRect(0, 0, this.screenWidth, this.screenHeight);
        this.ctx.closePath();
        this.minimap.render();
        const intersections = this.camera.renderAndGetIntersections();
        for (let i = 0; i < intersections.length; i++) {
            const intersection = intersections[i];
            const isVerticalIntersection = intersection.type === INTERSECTION_TYPES.VERTICAL;
            const intersectionPoint = isVerticalIntersection ? intersection.x : intersection.y;
            const height = ((CELL_SIZE / intersection.distance) * (180 / FOV_DEGREES) * this.screenHeight) / 1.75;
            const obstacleIdx = Math.floor(intersectionPoint / CELL_SIZE);
            const shadowOffsetX = isVerticalIntersection ? TEXTURE_SIZE : 0;
            const reversedTextureOffsetX = intersection.shouldReverseTexture ? TEXTURE_SIZE : 0;
            const textureRenderPointX = (intersectionPoint - obstacleIdx * CELL_SIZE) * TEXTURE_SCALE;
            const textureOffsetX = Math.floor(Math.abs(reversedTextureOffsetX - textureRenderPointX)) + shadowOffsetX;
            if (intersection.distance !== RAY_LENGTH) {
                this.ctx.drawImage(this.textures, textureOffsetX + 128, 128, 1, TEXTURE_SIZE, i, this.screenHeight / 2 - height / 2, 1, height);
            }
            this.ctx.fillStyle = '#5f5f61';
            this.ctx.fillRect(i, this.screenHeight / 2 - height / 2, 1, height);
            this.ctx.fillStyle = '#5f5f61';
            this.ctx.fillRect(i, 0, 1, Math.ceil(this.screenHeight / 2 - height / 2));
        }
    }
    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.screenHeight = height;
        this.screenWidth = width;
        this.camera.changeRaysAmount(this.canvas.width);
    }
    generateObstaclesFromMap(map) {
        const obstacles = [];
        for (let i = 0; i < map.length; i++) {
            for (let j = 0; j < map[i].length; j++) {
                if (map[i][j]) {
                    obstacles.push({
                        x1: j * CELL_SIZE,
                        y1: i * CELL_SIZE,
                        x2: j * CELL_SIZE + CELL_SIZE,
                        y2: i * CELL_SIZE + CELL_SIZE,
                    });
                }
            }
        }
        return obstacles;
    }
}
//# sourceMappingURL=build.js.map