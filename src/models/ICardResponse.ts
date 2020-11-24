import { SizeOption } from '@/models/ISize';

export interface ICardPagesResponse {
  title: string;
  templateId: string;
}

export interface ICardResponse {
  id: string;
  title: string;
  sizes: SizeOption[];
  basePrice: number;
  pages: ICardPagesResponse[];
}
