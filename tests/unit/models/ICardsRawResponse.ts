import { ICardPagesResponse } from '@/models/ICardsResponse';

export interface ICardsRawResponse {
  id: string;
  title: string;
  sizes: string[];
  basePrice: number;
  pages: ICardPagesResponse[];
}
