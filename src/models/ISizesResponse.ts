import { SizeOption } from '@/models/ISize';

export interface ISizesResponse {
  id: SizeOption;
  title: string;
  priceMultiplier: number;
}
