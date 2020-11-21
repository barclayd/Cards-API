import { Field, ObjectType, registerEnumType } from 'type-graphql';
import { Card } from '@/entity/Card';

export enum SizeOption {
  sm = 'sm',
  md = 'md',
  gt = 'gt',
}

registerEnumType(SizeOption, {
  name: 'SizeOption',
  description: 'Supported size options for a card',
});


@ObjectType()
export class CardDetail extends Card {
  @Field(() => SizeOption)
  size: SizeOption;
}
