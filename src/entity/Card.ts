import { Field, ObjectType } from 'type-graphql';
import { SizeOption } from '@/models/ISize';

@ObjectType()
export class Card {
  @Field()
  title: string;

  @Field()
  imageUrl: string;

  @Field()
  url: string;

  sizes: SizeOption[];
}
