import { SizeOption } from '@/models/ISize';
import {Page} from '@/entity/Page'

export interface ICardPagesResponse {
  title: string;
  templateId: string;
}

export interface ICardTemplate {
  id: string;
  title: string;
  sizes: SizeOption[];
  basePrice: number;
  pages: Page[];
}

export interface ICardGeneration {

}
