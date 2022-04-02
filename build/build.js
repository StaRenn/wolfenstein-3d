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
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
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
        const fpsOut = document.getElementById('fps');
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
    });
}
window.onload = main;
class Camera {
    constructor(position, raysAmount, ctx, obstacles, map) {
        this.angle = this.toRadians(60);
        this.verticalSpeed = 0;
        this.horizontalSpeed = 0;
        this.ctx = ctx;
        this.obstacles = obstacles;
        this.currentlyMovingObstacles = [];
        this.position = position;
        this.map = map;
        window.addEventListener('keypress', this.handleKeyPress.bind(this));
        window.addEventListener('keydown', this.handleKeyDown.bind(this));
        window.addEventListener('keyup', this.handleKeyUp.bind(this));
        window.addEventListener('mousemove', this.rotate.bind(this));
        this.changeRaysAmount(raysAmount);
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
                const intersection = this.getViewAngleIntersection(obstacle.position);
                const distance = Math.sqrt((this.position.x - obstacle.position.x1) ** 2 + (this.position.y - obstacle.position.y1) ** 2);
                if (intersection && distance <= CELL_SIZE * 2) {
                    obstacleInViewIndex = i;
                    obstacleInView = obstacle;
                }
            }
            if (!obstacleInViewIndex ||
                !obstacleInView ||
                this.hasEqualPosition(obstacleInView.position, obstacleInView.endPosition)) {
                return;
            }
            this.currentlyMovingObstacles[obstacleInViewIndex] = obstacleInView;
        }
    }
    handleKeyDown(event) {
        if (event.keyCode === 87) {
            this.verticalSpeed = CAMERA_SPEED;
        }
        else if (event.keyCode === 83) {
            this.verticalSpeed = -CAMERA_SPEED;
        }
        else if (event.keyCode === 68) {
            this.horizontalSpeed = CAMERA_SPEED;
        }
        else if (event.keyCode === 65) {
            this.horizontalSpeed = -CAMERA_SPEED;
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
    hasEqualPosition(firstPosition, secondPosition) {
        return (firstPosition.x1 === secondPosition.x1 &&
            firstPosition.y1 === secondPosition.y1 &&
            firstPosition.x2 === secondPosition.x2 &&
            firstPosition.y2 === secondPosition.y2);
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
    toRadians(angle) {
        return (angle * Math.PI) / 180;
    }
    getAreaSize(x1, y1, x2, y2, x3, y3) {
        return Math.abs((x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)) / 2.0);
    }
    getIsVertexInTheTriangle({ x, y }, { x1, y1, x2, y2, x3, y3 }) {
        const abcArea = this.getAreaSize(x1, y1, x2, y2, x3, y3);
        const pbcArea = this.getAreaSize(x, y, x2, y2, x3, y3);
        const pacArea = this.getAreaSize(x1, y1, x, y, x3, y3);
        const pabArea = this.getAreaSize(x1, y1, x2, y2, x, y);
        return Math.round(abcArea) == Math.round(pbcArea + pacArea + pabArea);
    }
    getVertexByPositionAndAngle(position, angle) {
        return {
            x: position.x + RAY_LENGTH * Math.sin(angle),
            y: position.y + RAY_LENGTH * Math.cos(angle),
        };
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
    getVisibleWalls() {
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
        const visibleWalls = this.obstacles.reduce((acc, obstacle, i) => {
            const obstaclePos = obstacle.position;
            const obstacleNeighbors = this.getNeighbors(obstaclePos);
            if (obstacle.isDoor) {
                const type = obstacle.isVertical ? OBSTACLE_SIDES.TOP : OBSTACLE_SIDES.LEFT;
                acc.push(this.getWallFromObstacle(obstacle, i, type, null));
                return acc;
            }
            if (this.position.x <= obstaclePos.x1 && (!obstacleNeighbors.LEFT || obstacleNeighbors.LEFT.isMovable)) {
                acc.push(this.getWallFromObstacle(obstacle, i, OBSTACLE_SIDES.LEFT, obstacleNeighbors.LEFT));
            }
            if (this.position.x >= obstaclePos.x2 && (!obstacleNeighbors.RIGHT || obstacleNeighbors.RIGHT.isMovable)) {
                acc.push(this.getWallFromObstacle(obstacle, i, OBSTACLE_SIDES.RIGHT, obstacleNeighbors.RIGHT));
            }
            if (this.position.y <= obstaclePos.y1 && (!obstacleNeighbors.TOP || obstacleNeighbors.TOP.isMovable)) {
                acc.push(this.getWallFromObstacle(obstacle, i, OBSTACLE_SIDES.TOP, obstacleNeighbors.TOP));
            }
            if (this.position.y >= obstaclePos.y2 && (!obstacleNeighbors.BOTTOM || obstacleNeighbors.BOTTOM.isMovable)) {
                acc.push(this.getWallFromObstacle(obstacle, i, OBSTACLE_SIDES.BOTTOM, obstacleNeighbors.BOTTOM));
            }
            return acc;
        }, []);
        const visibleWallsByLength = visibleWalls.filter((wall) => wall.position.y1 >= lengthBoundaries.y1 &&
            wall.position.x1 >= lengthBoundaries.x1 &&
            wall.position.x2 <= lengthBoundaries.x2 &&
            wall.position.y2 <= lengthBoundaries.y2);
        const visibleWallsByRange = visibleWallsByLength.filter((wall) => {
            const isLookingAt = !!this.getViewAngleIntersection(wall.position);
            const { x1, y1, x2, y2 } = wall.position;
            return (isLookingAt ||
                this.getIsVertexInTheTriangle({ x: x1, y: y1 }, rangeBoundaries) ||
                this.getIsVertexInTheTriangle({ x: x2, y: y2 }, rangeBoundaries));
        });
        const visibleWallsByCameraVertexIntersections = visibleWallsByRange.filter((visibleWall, i) => {
            return !visibleWallsByRange.some(wall => {
                return [
                    { x1: visibleWall.position.x1, y1: visibleWall.position.y1, x2: this.position.x, y2: this.position.y },
                    { x1: visibleWall.position.x2, y1: visibleWall.position.y2, x2: this.position.x, y2: this.position.y },
                ].every(vector => {
                    if (wall === visibleWall) {
                        return false;
                    }
                    return !!Ray.getIntersectionVertexWithWall(vector, wall.position);
                });
            });
        });
        return {
            byLength: visibleWallsByLength,
            byRange: visibleWallsByRange,
            byCameraIntersections: visibleWallsByCameraVertexIntersections,
        };
    }
    getChange(startPosition, endPosition) {
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
                x1: obstacle.position.x1 + this.getChange(obstacle.position.x1, obstacle.endPosition.x1),
                y1: obstacle.position.y1 + this.getChange(obstacle.position.y1, obstacle.endPosition.y1),
                x2: obstacle.position.x2 + this.getChange(obstacle.position.x2, obstacle.endPosition.x2),
                y2: obstacle.position.y2 + this.getChange(obstacle.position.y2, obstacle.endPosition.y2),
            };
            if (obstacle.position.x1 === obstacle.endPosition.x1 &&
                obstacle.position.y1 === obstacle.endPosition.y1 &&
                obstacle.position.x2 === obstacle.endPosition.x2 &&
                obstacle.position.y2 === obstacle.endPosition.y2) {
                delete this.currentlyMovingObstacles[Number(key)];
            }
        });
    }
    move() {
        if (this.horizontalSpeed === 0 && this.verticalSpeed === 0) {
            return;
        }
        const position = { x: this.position.x, y: this.position.y };
        const verticalChangeX = Math.sin(this.angle) * this.verticalSpeed;
        const verticalChangeY = Math.cos(this.angle) * this.verticalSpeed;
        const horizontalChangeX = Math.sin(this.angle + Math.PI / 2) * this.horizontalSpeed;
        const horizontalChangeY = Math.cos(this.angle + Math.PI / 2) * this.horizontalSpeed;
        const xSum = verticalChangeX + horizontalChangeX;
        const ySum = verticalChangeY + horizontalChangeY;
        position.x += xSum >= 0 ? Math.min(xSum, CAMERA_SPEED) : Math.max(xSum, -CAMERA_SPEED);
        position.y += ySum >= 0 ? Math.min(ySum, CAMERA_SPEED) : Math.max(ySum, -CAMERA_SPEED);
        for (let wall of this.visibleWalls.byLength) {
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
        }
        for (let i = 0; i < this.rays.length; i++) {
            this.rays[i].move(position);
        }
        this.position = position;
    }
    renderAndGetIntersections() {
        let intersections = [];
        this.ctx.strokeStyle = 'orange';
        this.ctx.beginPath();
        this.moveObstacles();
        this.move();
        this.visibleWalls = this.getVisibleWalls();
        for (let ray of this.rays) {
            const intersection = ray.cast(this.visibleWalls.byCameraIntersections);
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
        this.angle += this.toRadians(event.movementX / 2);
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
    render() {
        this.ctx.fillStyle = 'white';
        for (let obstacle of this.obstacles) {
            if (!obstacle.isDoor) {
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
                textureId: 1,
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
        this.screenHeight = this.canvas.height;
        this.screenWidth = this.canvas.width;
        this.obstacles = this.generateObstaclesFromMap(map);
        this.textures = [];
        for (let i = 1; i < 31; i++) {
            const image = document.createElement('img');
            image.src = `src/textures/${i}.png`;
            this.textures.push(image);
        }
        this.camera = new Camera(CAMERA_START_POSITION, this.screenWidth, this.ctx, this.obstacles, this.map);
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
            const wall = intersection.wall;
            const isVerticalIntersection = wall.type === INTERSECTION_TYPES.VERTICAL;
            const intersectionPoint = isVerticalIntersection ? intersection.x : intersection.y;
            const height = ((CELL_SIZE / intersection.distance) * (180 / FOV_DEGREES) * this.screenHeight) / 1.75;
            const obstacleIdx = Math.floor(intersectionPoint / CELL_SIZE);
            const movingTextureOffset = isVerticalIntersection
                ? obstacleIdx * CELL_SIZE - wall.position.x1
                : obstacleIdx * CELL_SIZE - wall.position.y1;
            const movingOffset = movingTextureOffset * TEXTURE_SCALE * (wall.shouldReverseTexture && wall.isMovable ? -1 : 1);
            const reversedTextureOffsetX = wall.shouldReverseTexture ? TEXTURE_SIZE : 0;
            const textureRenderPointX = (intersectionPoint - obstacleIdx * CELL_SIZE) * TEXTURE_SCALE;
            const textureOffsetX = Math.floor(Math.abs(reversedTextureOffsetX - (wall.isMovable ? textureRenderPointX % 64 : textureRenderPointX)) +
                movingOffset);
            if (intersection.distance !== RAY_LENGTH) {
                this.ctx.drawImage(this.textures[wall.textureId - (isVerticalIntersection ? 0 : 1)], textureOffsetX, 0, 1, TEXTURE_SIZE, i, this.screenHeight / 2 - height / 2, 1, height);
            }
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
                    const isVertical = !!(map[i][j - 1] && map[i][j + 1]);
                    const position = {
                        x1: j * CELL_SIZE + (!isVertical && isDoor ? CELL_SIZE * 0.5 : 0),
                        y1: i * CELL_SIZE + (isVertical && isDoor ? CELL_SIZE * 0.5 : 0),
                        x2: j * CELL_SIZE + (!isVertical && isDoor ? CELL_SIZE * 0.5 : CELL_SIZE),
                        y2: i * CELL_SIZE + (isVertical && isDoor ? CELL_SIZE * 0.5 : CELL_SIZE),
                    };
                    obstacles.push({
                        position,
                        endPosition: isSecret
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
                        textureId: valueNumber,
                    });
                }
            }
        }
        return obstacles;
    }
}
//# sourceMappingURL=build.js.map