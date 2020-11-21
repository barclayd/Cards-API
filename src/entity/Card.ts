import { Field, Float, ObjectType, registerEnumType } from 'type-graphql';
import { CardPreview } from '@/entity/CardPreview';
import { SizeOption } from '@/models/ISize';
import { Size } from '@/entity/Size';
import { Page } from '@/entity/Page';

registerEnumType(SizeOption, {
  name: 'SizeOption',
  description: 'Supported size options for a card',
});

@ObjectType()
export class Card extends CardPreview {
  @Field(() => SizeOption, { nullable: true })
  size?: SizeOption;

  @Field(() => [Size])
  availableSizes: Size[];

  @Field(() => [Page])
  pages: Page[];

  @Field(() => Float)
  price: number;
}
