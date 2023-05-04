import { INTERSECTION_TYPES, TEXTURE_SIZE } from 'src/constants/config';

import type { IndexedIntersection, Obstacle } from 'src/types';
import { isDoor, isItem, isSprite, isWall } from 'src/types/typeGuards';

// we calculate object width in players perspective
// calculate length from start of the plane to the intersection |object.x - intersection.x| = n
// then we get coefficient: n / planeLength = k
// floor(k * TEXTURE_SIZE) = texture offset for given intersection
export function getTextureOffset(intersection: IndexedIntersection<Obstacle>) {
  const { obstacle } = intersection;
  const { position } = obstacle;
  const isVerticalIntersection =
    (isWall(obstacle) || isDoor(obstacle)) && obstacle.intersectionType === INTERSECTION_TYPES.VERTICAL;

  let isInverse = false;

  if (isSprite(obstacle) || isItem(obstacle)) {
    if (Math.abs(position.x1 - position.x2) > Math.abs(position.y1 - position.y2)) {
      isInverse = true;
    }
  }

  const coordinatesToCompareWith =
    (isWall(obstacle) || isDoor(obstacle)) && obstacle.shouldReverseTexture
      ? { x: position.x2, y: position.y2 }
      : { x: position.x1, y: position.y1 };

  const fromPlaneStartToIntersectionWidth =
    isVerticalIntersection || isInverse
      ? coordinatesToCompareWith.x - intersection.intersectionVertex.x
      : coordinatesToCompareWith.y - intersection.intersectionVertex.y;

  const planeLength =
    isVerticalIntersection || isInverse ? Math.abs(position.x1 - position.x2) : Math.abs(position.y1 - position.y2);

  const textureDistanceFromStartCoefficient = Math.abs(fromPlaneStartToIntersectionWidth) / planeLength;

  return Math.floor(textureDistanceFromStartCoefficient * TEXTURE_SIZE);
}
