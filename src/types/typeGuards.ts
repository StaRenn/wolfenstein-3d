import type { DoorObstacle } from 'src/models/obstacles/Door';
import type { ItemObstacle } from 'src/models/obstacles/Item';
import type { SpriteObstacle } from 'src/models/obstacles/Sprite';
import type { WallObstacle } from 'src/models/obstacles/Wall';

import type { Enemy } from 'src/models/actors/abstract/Enemy';

import { DIRECTED_FRAME_SETS_BY_ACTION, NON_DIRECTED_FRAME_SETS_BY_ACTION } from 'src/helpers/frameSets';

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

export const isMovableEntity = (plane: unknown): plane is DoorObstacle | WallObstacle => {
  return isDoor(plane) || isWall(plane);
};

export const isNonDirectedFrameSetByAction = (
  state: string
): state is typeof NON_DIRECTED_FRAME_SETS_BY_ACTION[number] => {
  return NON_DIRECTED_FRAME_SETS_BY_ACTION.includes(state as typeof NON_DIRECTED_FRAME_SETS_BY_ACTION[number]);
};

export const isDirectedFrameSetByAction = (state: string): state is typeof DIRECTED_FRAME_SETS_BY_ACTION[number] => {
  return DIRECTED_FRAME_SETS_BY_ACTION.includes(state as typeof DIRECTED_FRAME_SETS_BY_ACTION[number]);
};
