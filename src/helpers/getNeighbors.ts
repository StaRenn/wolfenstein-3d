import { Obstacle, ParsedMap, Vertex } from '../types';
import { NEIGHBOR_OFFSET, OBSTACLE_SIDES } from '../constants/config';

export function getNeighbors(map: ParsedMap, matrixCoordinates: Vertex) {
  const neighbors: Record<keyof typeof OBSTACLE_SIDES, Obstacle | null> = {
    [OBSTACLE_SIDES.TOP]: null,
    [OBSTACLE_SIDES.LEFT]: null,
    [OBSTACLE_SIDES.BOTTOM]: null,
    [OBSTACLE_SIDES.RIGHT]: null,
  };

  Object.keys(neighbors).forEach((side, i) => {
    const offset = NEIGHBOR_OFFSET[side as keyof typeof OBSTACLE_SIDES];

    const axisY = map[matrixCoordinates.y + (1 - (i % 2)) * offset];

    if (axisY) {
      const axisXValue = axisY[matrixCoordinates.x + (i % 2) * offset];

      if (axisXValue) {
        neighbors[side as keyof typeof OBSTACLE_SIDES] = axisXValue;
      }
    }
  });

  return neighbors;
}
