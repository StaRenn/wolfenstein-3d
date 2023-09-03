import { NavigationNode } from './NavigationNode';

import type { ParsedMap } from 'src/types';
import { isDoor, isWall } from 'src/types/typeGuards';

export class NavigationMap {
  private _parsedMap: ParsedMap;
  private _navigationMap: NavigationNode[][];

  constructor(parsedMap: ParsedMap) {
    this._parsedMap = parsedMap;

    this._navigationMap = this.prepareMap();
  }

  private prepareMap() {
    return this._parsedMap.map((row, y) => {
      return row.map((element, x) => {
        return new NavigationNode({
          x,
          y,
          isPassable: !element || !element.hasCollision || isDoor(element) || (isWall(element) && element.isMovable),
          isDoor: isDoor(element),
          originalObstacle: element,
        });
      });
    });
  }

  updateMap(parsedMap: ParsedMap) {
    this._parsedMap = parsedMap;
    this._navigationMap = this.prepareMap();

    return this.mapCopy;
  }

  get mapCopy() {
    return this._navigationMap.map((row) => {
      return row.map((node) => node.makeCopy());
    });
  }
}
