import { SizeOption } from '@/models/ISize';
import { ICardPagesResponse } from '@/models/ICardsResponse';
import { CardPreview } from '@/entity/CardPreview';

export const generateCardPreview = (
  title = 'some title',
  imageUrl = '/imageUrl.jpg',
  url = '/url',
  sizes: SizeOption[] = [SizeOption.sm, SizeOption.md, SizeOption.lg],
  pages: ICardPagesResponse[] = [
    {
      title: 'someTitle',
      templateId: 'template001',
    },
  ],
  basePrice = 100,
): CardPreview => {
  return new CardPreview(title, imageUrl, url, sizes, pages, basePrice);
};
