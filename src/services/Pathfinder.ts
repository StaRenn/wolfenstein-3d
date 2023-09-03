import { NEIGHBORS_NEXT_TO_CORNERS, NEIGHBOR_OFFSET_WITH_CORNERS } from 'src/constants/config';

import type { NavigationMap } from './NavigationMap/NavigationMap';
import type { NavigationNode } from './NavigationMap/NavigationNode';

import type { Vertex } from 'src/types';

// bfs
// todo rewrite to A*
export class Pathfinder {
  private _navigationMap: NavigationMap;
  private _mapWidth: number;
  private _mapHeight: number;
  private _cachedResult: null | NavigationNode;
  private _cachedStart: null | Vertex;
  private _cachedEnd: null | Vertex;

  constructor(navigationMap: NavigationMap) {
    this._navigationMap = navigationMap;

    this._cachedResult = null;
    this._cachedStart = null;
    this._cachedEnd = null;

    const copy = this._navigationMap.mapCopy;

    this._mapHeight = copy.length;
    this._mapWidth = this._mapHeight > 0 ? copy[0].length : 0;
  }

  checkCache(start: Vertex, end: Vertex) {
    if (!this._cachedResult || !this._cachedStart || !this._cachedEnd) {
      return null;
    }

    if (
      this._cachedStart.x !== start.x ||
      this._cachedStart.y !== start.y ||
      this._cachedEnd.x !== end.x ||
      this._cachedEnd.y !== end.y
    ) {
      this._cachedEnd = null;
      this._cachedStart = null;
      this._cachedResult = null;
    }

    return this._cachedResult;
  }

  getNodeOrNull(map: NavigationNode[][], x: number, y: number) {
    if (x < 0 || x >= this._mapWidth || y < 0 || y >= this._mapHeight) {
      return null;
    }

    return map[y][x];
  }

  static getNextFromStart(node: NavigationNode, start: Vertex) {
    let current = node;

    while (current.previous) {
      const { previous } = current;

      if (previous.x === start.x && previous.y === start.y) {
        return current;
      }

      current = previous;
    }

    return null;
  }

  findPath(start: Vertex, end: Vertex, shouldIgnoreClosedDoors = true) {
    const cachedResult = this.checkCache(start, end);

    if (cachedResult) {
      return Pathfinder.getNextFromStart(cachedResult, start);
    }

    const map = this._navigationMap.mapCopy;

    const queue = [map[start.y][start.x]];

    while (queue.length) {
      const current = queue.shift()!;

      if (current.x === end.x && current.y === end.y) {
        this._cachedStart = start;
        this._cachedEnd = end;
        this._cachedResult = current;

        return Pathfinder.getNextFromStart(current, start);
      }

      for (const [direction, offset] of Object.entries(NEIGHBOR_OFFSET_WITH_CORNERS)) {
        const neighbor = this.getNodeOrNull(map, current.x + offset.x, current.y + offset.y);

        if (neighbor && neighbor.isDoor && neighbor.originalObstacle?.hasCollision && !shouldIgnoreClosedDoors) {
          continue;
        }

        if (neighbor && !neighbor.isPassable) {
          neighbor.isVisited = true;

          continue;
        }

        // check if diagonal movement is blocked by near walls
        if (neighbor && NEIGHBORS_NEXT_TO_CORNERS[direction as keyof typeof NEIGHBORS_NEXT_TO_CORNERS]) {
          const neighborsToCheck = NEIGHBORS_NEXT_TO_CORNERS[direction as keyof typeof NEIGHBORS_NEXT_TO_CORNERS];

          const neighborsArePassable = neighborsToCheck.every((neighborOffset) => {
            const cornerNeighbor = this.getNodeOrNull(
              map,
              neighbor.x + neighborOffset.x,
              neighbor.y + neighborOffset.y
            );

            return !cornerNeighbor || cornerNeighbor.isPassable;
          });

          if (!neighborsArePassable) {
            continue;
          }
        }

        if (neighbor && !neighbor.isVisited) {
          queue.push(neighbor);

          neighbor.isVisited = true;
          neighbor.previous = current;
        }
      }
    }

    return null;
  }
}
