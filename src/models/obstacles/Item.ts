import { ActorStats, ItemPurpose } from '../../types';
import { EntityParams } from '../abstract/Entity';
import { SpriteObstacle } from './Sprite';

export type ItemParams = EntityParams & {
  purpose: ItemPurpose<ActorStats>;
};

export class ItemObstacle extends SpriteObstacle {
  public readonly isItem: true;
  public readonly purpose: ItemPurpose<ActorStats>;

  constructor(params: ItemParams) {
    super(params);

    this.isItem = true;
    this.purpose = params.purpose;
  }
}
