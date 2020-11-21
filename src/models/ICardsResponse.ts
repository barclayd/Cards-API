import { SizeOption } from '@/entity/CardDetail';

export interface IPage {
  title: string;
  templateId: string;
}

export interface ICardsResponse {
  id: string;
  title: string;
  size: SizeOption;
  basePrice: number;
  pages: IPage[]
}
