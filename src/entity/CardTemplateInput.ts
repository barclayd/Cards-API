import { SizeOption } from '@/models/ISize';
import {Page} from '@/entity/Page'
import 'reflect-metadata';
import { Field, Float, ObjectType } from 'type-graphql';

export interface ICardTemplateInput {
  title: string;
  sizes: SizeOption[];
  basePrice: number;
  pages: Page[];
}

@ObjectType()
export class CardTemplateInput implements ICardTemplateInput {
  constructor(
    title: string,
    sizes: SizeOption[],
    basePrice: number,
    pages: Page[],
  ) {
    this.title = title;
    this.sizes = sizes;
    this.basePrice = basePrice;
    this.pages = pages;
  }

  @Field()
  title: string;

  @Field(() => [SizeOption])
  sizes: SizeOption[];

  @Field(() => Float)
  basePrice: number;

  @Field(() => [Page])
  pages: Page[];
}