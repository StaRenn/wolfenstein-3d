type Intersection = {
  x: number;
  y: number;
  wall: Wall;
  distance: number;
};

class Ray {
  private rayAngle: number;
  private cameraAngle: number;
  private cameraPosition: Vector;

  constructor(position: Vertex, angle: number, cameraAngle: number) {
    this.rayAngle = angle;
    this.cameraAngle = cameraAngle;

    this.cameraPosition = {
      x1: position.x,
      y1: position.y,
      x2: position.x + Math.sin(angle) * RAY_LENGTH,
      y2: position.y + Math.cos(angle) * RAY_LENGTH,
    };
  }

  changeAngle(angle: number, cameraAngle: number) {
    this.cameraAngle = cameraAngle;
    this.rayAngle = angle;

    this.move({ x: this.cameraPosition.x1, y: this.cameraPosition.y1 });
  }

  fixFishEye(distance: number) {
    return distance * Math.cos(this.rayAngle - this.cameraAngle);
  }

  static getIntersectionVertexWithWall(firstVector: Vector, secondVector: Vector) {
    const { x1, x2, y1, y2 } = firstVector;
    const { x1: x3, y1: y3, x2: x4, y2: y4 } = secondVector;

    // Check if none of the lines are of length 0
    if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
      return;
    }

    const denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);

    // Lines are parallel
    if (denominator === 0) {
      return;
    }

    let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
    let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;

    // is the intersection along the segments
    if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
      return;
    }

    // Return a object with the x and y coordinates of the intersection
    let x = x1 + ua * (x2 - x1);
    let y = y1 + ua * (y2 - y1);

    return { x, y };
  }

  getDistance(wall: Vertex) {
    return Math.sqrt((wall.x - this.cameraPosition.x1) ** 2 + (wall.y - this.cameraPosition.y1) ** 2);
  }

  move(position: Vertex) {
    this.cameraPosition = {
      x1: position.x,
      y1: position.y,
      x2: position.x + Math.sin(this.rayAngle) * RAY_LENGTH,
      y2: position.y + Math.cos(this.rayAngle) * RAY_LENGTH,
    };
  }

  cast(walls: Wall[]): Intersection {
    let intersections: { vertex: Vertex; wall: Wall }[] = [];

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
        // doesnt really matter
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
