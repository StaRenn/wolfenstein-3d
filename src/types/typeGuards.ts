import type { Enemy } from 'src/entities/actors/abstract/Enemy';
import type { DoorObstacle } from 'src/entities/obstacles/Door';
import type { ItemObstacle } from 'src/entities/obstacles/Item';
import type { SpriteObstacle } from 'src/entities/obstacles/Sprite';
import type { WallObstacle } from 'src/entities/obstacles/Wall';

export const isSprite = (plane: unknown): plane is SpriteObstacle => {
  return !!plane && !!(plane as Partial<SpriteObstacle>).isSprite;
};

export const isItem = (plane: unknown): plane is ItemObstacle => {
  return !!plane && !!(plane as Partial<ItemObstacle>).isItem;
};

export const isWall = (plane: unknown): plane is WallObstacle => {
  return !!plane && !!(plane as Partial<WallObstacle>).isWall;
};

export const isDoor = (plane: unknown): plane is DoorObstacle => {
  return !!plane && !!(plane as Partial<DoorObstacle>).isDoor;
};

export const isEnemy = (plane: unknown): plane is Enemy => {
  return !!plane && !!(plane as Partial<Enemy>).isEnemy;
};

export const isDynamicObstacle = (plane: unknown): plane is DoorObstacle | WallObstacle => {
  return isDoor(plane) || isWall(plane);
};
