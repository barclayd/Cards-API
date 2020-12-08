import { Field, ObjectType, registerEnumType } from 'type-graphql';
import { CardPreview } from '@/entity/CardPreview';
import { SizeOption } from '@/models/ISize';
import { Size } from '@/entity/Size';
import { Page } from '@/entity/Page';
import { ICardPagesResponse } from '@/models/ICardTemplate';

registerEnumType(SizeOption, {
  name: 'SizeOption',
  description: 'Supported size options for a card',
});

@ObjectType()
export class Card extends CardPreview {
  constructor(
    title: string,
    imageUrl: string,
    url: string,
    sizes: SizeOption[],
    previewPages: ICardPagesResponse[],
    basePrice: number,
    availableSizes: Size[],
    pages: Page[],
    price: string,
    size?: SizeOption,
  ) {
    super(title, imageUrl, url, sizes, previewPages, basePrice);
    this.availableSizes = availableSizes;
    this.pages = pages;
    this.price = price;
    this.size = size;
  }

  @Field(() => SizeOption, { nullable: true })
  size?: SizeOption;

  @Field(() => [Size])
  availableSizes: Size[];

  @Field(() => [Page])
  pages: Page[];

  @Field()
  price: string;
}
