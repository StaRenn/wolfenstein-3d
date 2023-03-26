import { ActorStats, ItemPurpose, Obstacle } from './index';
import { SpriteObstacle } from '../models/obstacles/Sprite';
import { ItemObstacle } from '../models/obstacles/Item';
import { WallObstacle } from '../models/obstacles/Wall';
import { DoorObstacle } from '../models/obstacles/Door';

export const isSprite = (plane: Obstacle | null): plane is SpriteObstacle => {
  return !!plane && !!(plane as Partial<SpriteObstacle>).isSprite;
};

export const isItem = (plane: Obstacle | null): plane is ItemObstacle => {
  return !!plane && !!(plane as Partial<ItemObstacle>).isItem;
};

export const isWall = (plane: Obstacle | null): plane is WallObstacle => {
  return !!plane && !!(plane as Partial<WallObstacle>).isWall;
};

export const isDoor = (plane: Obstacle | null): plane is DoorObstacle => {
  return !!plane && !!(plane as Partial<DoorObstacle>).isDoor;
};

export const isMovableEntity = (plane: Obstacle | null): plane is DoorObstacle | WallObstacle => {
  return isDoor(plane) || isWall(plane);
};

// todo rename
export const isDesiredPurpose = <T extends ActorStats>(
  purpose: ItemPurpose<ActorStats>,
  type: T
): purpose is ItemPurpose<T> => {
  return purpose.affects === type;
};
