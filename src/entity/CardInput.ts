import { Field, InputType } from 'type-graphql';
import { SizeOption } from '@/models/ISize';

@InputType()
export class CardInput {
  @Field()
  cardId: string;

  @Field(() => SizeOption, { nullable: true })
  sizeId?: SizeOption;
}
