import { CardPreview } from '@/entity/CardPreview';
import { CardInput } from '@/entity/CardInput';
import { Card } from '@/entity/Card';

export interface ICardResolverService {
  cards(): Promise<CardPreview[]>;
  card(input: CardInput): Promise<Card>;
}
