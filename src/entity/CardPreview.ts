import 'reflect-metadata';
import { Field, ObjectType } from 'type-graphql';
import { SizeOption } from '@/models/ISize';
import { ICardPagesResponse } from '@/models/ICardResponse';

@ObjectType()
export class CardPreview {
  constructor(
    title: string,
    imageUrl: string,
    url: string,
    sizes: SizeOption[],
    pages: ICardPagesResponse[],
    basePrice: number,
  ) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.url = url;
    this.sizes = sizes;
    this.pages = pages;
    this.basePrice = basePrice;
  }

  @Field()
  title: string;

  @Field()
  imageUrl: string;

  @Field()
  url: string;

  sizes: SizeOption[];
  pages: ICardPagesResponse[];
  basePrice: number;
}
