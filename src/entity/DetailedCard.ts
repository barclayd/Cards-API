import { Field, Float, ObjectType, registerEnumType } from 'type-graphql';
import { Card } from '@/entity/Card';
import { SizeOption } from '@/models/ISize';
import { Size } from '@/entity/Size';

registerEnumType(SizeOption, {
  name: 'SizeOption',
  description: 'Supported size options for a card',
});

@ObjectType()
export class DetailedCard extends Card {
  @Field(() => SizeOption, { nullable: true })
  size?: SizeOption;

  @Field(() => [Size])
  availableSizes: Size[];

  @Field(() => Float)
  price: number;
}
