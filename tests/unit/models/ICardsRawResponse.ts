import { ICardPagesResponse } from '@/models/ICardResponse';

export interface ICardsRawResponse {
  id: string;
  title: string;
  sizes: string[];
  basePrice: number;
  pages: ICardPagesResponse[];
}
