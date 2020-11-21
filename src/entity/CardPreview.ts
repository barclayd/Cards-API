import { Field, ObjectType } from 'type-graphql';
import { SizeOption } from '@/models/ISize';
import { ICardPagesResponse } from '@/models/ICardsResponse';

@ObjectType()
export class CardPreview {
  @Field()
  title: string;

  @Field()
  imageUrl: string;

  @Field()
  url: string;

  sizes: SizeOption[];
  pages: ICardPagesResponse[];
}
