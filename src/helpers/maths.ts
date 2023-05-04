import { RAY_LENGTH } from 'src/constants/config';

import type { Triangle, Vector, Vertex } from 'src/types';

export function toRadians(angle: number) {
  return (angle * Math.PI) / 180;
}

export function toDegrees(angleRad: number) {
  return (180 / Math.PI) * angleRad;
}

export function clamp(number: number, min: number, max: number) {
  return Math.max(min, Math.min(number, max));
}

export function hasEqualPosition(firstPosition: Vector, secondPosition: Vector) {
  return (
    firstPosition.x1 === secondPosition.x1 &&
    firstPosition.y1 === secondPosition.y1 &&
    firstPosition.x2 === secondPosition.x2 &&
    firstPosition.y2 === secondPosition.y2
  );
}

export function getAreaSize(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) {
  return Math.abs((x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)) / 2.0);
}

export function getAngleBetweenVertexes(vertexAPosition: Vertex, vertexBPosition: Vertex) {
  const dx = vertexBPosition.x - vertexAPosition.x;
  const dy = vertexBPosition.y - vertexAPosition.y;

  return Math.atan2(dx, dy);
}

export function getVertexByPositionAndAngle(vertex: Vertex, angle: number): Vertex {
  return {
    x: vertex.x + RAY_LENGTH * Math.sin(angle),
    y: vertex.y + RAY_LENGTH * Math.cos(angle),
  };
}

export function getDistanceBetweenVertexes(startVertex: Vertex, endVertex: Vertex) {
  return Math.sqrt((endVertex.x - startVertex.x) ** 2 + (endVertex.y - startVertex.y) ** 2);
}

export function getRangeOfView(angle: number, fov: number, position: Vertex): Triangle {
  const leftExtremumAngle = angle - fov;
  const rightExtremumAngle = angle + fov;

  const currentAngleRayEndVertex = getVertexByPositionAndAngle(position, angle);
  const leftFOVExtremumVertex = getVertexByPositionAndAngle(currentAngleRayEndVertex, leftExtremumAngle);
  const rightFOVExtremumVertex = getVertexByPositionAndAngle(currentAngleRayEndVertex, rightExtremumAngle);

  return {
    x1: position.x,
    y1: position.y,
    x2: leftFOVExtremumVertex.x,
    y2: leftFOVExtremumVertex.y,
    x3: rightFOVExtremumVertex.x,
    y3: rightFOVExtremumVertex.y,
  };
}

// https://www.geeksforgeeks.org/check-whether-a-given-point-lies-inside-a-triangle-or-not/
export function getIsVertexInTheTriangle({ x, y }: Vertex, { x1, y1, x2, y2, x3, y3 }: Triangle) {
  const abcArea = getAreaSize(x1, y1, x2, y2, x3, y3);
  const pbcArea = getAreaSize(x, y, x2, y2, x3, y3);
  const pacArea = getAreaSize(x1, y1, x, y, x3, y3);
  const pabArea = getAreaSize(x1, y1, x2, y2, x, y);

  return Math.round(abcArea) === Math.round(pbcArea + pacArea + pabArea);
}

export function vectorSize({ x, y }: Vertex) {
  return Math.sqrt(x * x + y * y);
}

export function unitVector({ x, y }: Vertex) {
  const magnitude = vectorSize({ x, y });

  return { x: x / magnitude, y: y / magnitude };
}

export function getDistanceWithoutFishEyeEffect(distance: number, mainAngle: number, secondaryAngle: number) {
  return distance * Math.cos(mainAngle - secondaryAngle);
}

export function getIntersectionVertexWithPlane(firstVector: Vector, secondVector: Vector) {
  const { x1, x2, y1, y2 } = firstVector;
  const { x1: x3, y1: y3, x2: x4, y2: y4 } = secondVector;

  // Check if none of the lines are of length 0
  if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
    return null;
  }

  const denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);

  // Lines are parallel
  if (denominator === 0) {
    return null;
  }

  const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
  const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;

  // is the intersection along the segments
  if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
    return null;
  }

  // Return a object with the x and y coordinates of the intersection
  const x = x1 + ua * (x2 - x1);
  const y = y1 + ua * (y2 - y1);

  return { x, y };
}
