import { SizeOption } from '@/models/ISize';

export interface IPage {
  title: string;
  templateId: string;
}

export interface ICardsResponse {
  id: string;
  title: string;
  sizes: SizeOption[];
  basePrice: number;
  pages: IPage[]
}
