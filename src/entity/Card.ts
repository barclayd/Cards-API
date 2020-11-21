import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class Card {
  constructor(title = '', imageUrl = '', url = '') {
    this.title = title;
    this.imageUrl = imageUrl;
    this.url = url;
  }

  @Field()
  title: string;

  @Field()
  imageUrl: string;

  @Field()
  url: string;
}
