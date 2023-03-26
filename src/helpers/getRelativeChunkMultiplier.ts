import { TILE_SIZE } from '../constants/config';

// rounding for chunk rendering, Math.round(distance * multiplier) / multiplier, same distance on multiple rays means
// that we can render these rays in 1 iteration that saves a lot of resources
// less = more performance, more artifacts
export function getRelativeChunkMultiplier(distance: number) {
  let relativeChunkMultiplier;

  if (distance < TILE_SIZE / 2) {
    relativeChunkMultiplier = 32;
  } else if (distance < TILE_SIZE * 3) {
    relativeChunkMultiplier = 16;
  } else if (distance < TILE_SIZE * 6) {
    relativeChunkMultiplier = 8;
  } else {
    relativeChunkMultiplier = 1;
  }

  return relativeChunkMultiplier;
}
