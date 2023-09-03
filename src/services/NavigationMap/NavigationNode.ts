import type { Obstacle } from 'src/types';

export type NavigationNodeParams = {
  x: NavigationNode['x'];
  y: NavigationNode['y'];
  isPassable: NavigationNode['isPassable'];
  isDoor: NavigationNode['isDoor'];
  originalObstacle: NavigationNode['originalObstacle'];
  isVisited?: NavigationNode['isVisited'];
  previous?: NavigationNode['previous'];
};

export class NavigationNode {
  public readonly x: number;
  public readonly y: number;
  public readonly isPassable: boolean;
  public readonly isDoor: boolean;
  public readonly originalObstacle: Obstacle | null;

  public isVisited: boolean;
  public previous: NavigationNode | null;

  constructor(params: NavigationNodeParams) {
    this.x = params.x;
    this.y = params.y;
    this.isPassable = params.isPassable;
    this.isDoor = params.isDoor;
    this.originalObstacle = params.originalObstacle;

    this.isVisited = params.isVisited || false;
    this.previous = params.previous || null;
  }

  makeCopy(): NavigationNode {
    return new NavigationNode({
      x: this.x,
      y: this.y,
      isPassable: this.isPassable,
      isDoor: this.isDoor,
      originalObstacle: this.originalObstacle,
      isVisited: this.isVisited,
      previous: this.previous,
    });
  }
}
