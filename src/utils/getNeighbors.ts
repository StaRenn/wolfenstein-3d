import { NEIGHBOR_OFFSET, OBSTACLE_SIDES } from 'src/constants/config';

import type { Obstacle, ParsedMap, Vertex } from 'src/types';

export function getNeighbors(map: ParsedMap, matrixCoordinates: Vertex) {
  const neighbors: Record<keyof typeof OBSTACLE_SIDES, Obstacle | null> = {
    [OBSTACLE_SIDES.TOP]: null,
    [OBSTACLE_SIDES.LEFT]: null,
    [OBSTACLE_SIDES.BOTTOM]: null,
    [OBSTACLE_SIDES.RIGHT]: null,
  };

  Object.keys(neighbors).forEach((side) => {
    const offset = NEIGHBOR_OFFSET[side as keyof typeof OBSTACLE_SIDES];

    const axisY = map[matrixCoordinates.y + offset.y];

    if (axisY) {
      const axisXValue = axisY[matrixCoordinates.x + offset.x];

      if (axisXValue) {
        neighbors[side as keyof typeof OBSTACLE_SIDES] = axisXValue;
      }
    }
  });

  return neighbors;
}
