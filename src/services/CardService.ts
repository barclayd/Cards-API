import { ICardsResponse } from '@/models/ICardsResponse';
import { ITemplatesResponse } from '@/models/ITemplatesResponse';
import { Card } from '@/entity/Card';

export class CardService {
  constructor(
    private cardsResponse: ICardsResponse[],
    private templatesResponse: ITemplatesResponse[],
  ) {}

  private cardUrl(cardId: string): string {
    return `/cards/${cardId}`;
  }

  private imageUrl(firstCardPageTemplateId: string): string {
    const template = this.templatesResponse.find(templateResponse => templateResponse.id === firstCardPageTemplateId);
    return template?.imageUrl ?? '';
  }

  public generateCards(): Card[] {
    return this.cardsResponse.reduce((acc, { title, id, pages }) => {
      const card = new Card(title);
      card.url = this.cardUrl(id);
      card.imageUrl = this.imageUrl(pages[0].templateId);
      acc.push(card);
      return acc;
    }, [] as Card[]);
  }
}
