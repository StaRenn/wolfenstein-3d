import { SpriteObstacle } from './Sprite';
import type { EntityParams } from './abstract/Entity';

import type { ItemPurpose } from 'src/types';

export type ItemParams = EntityParams & {
  purpose: ItemObstacle['purpose'];
};

export class ItemObstacle extends SpriteObstacle {
  public readonly isItem: true;
  public readonly purpose: ItemPurpose;

  constructor(params: ItemParams) {
    super(params);

    this.isItem = true;
    this.purpose = params.purpose;
  }
}
