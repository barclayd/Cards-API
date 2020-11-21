import { ICardsResponse } from '@/models/ICardsResponse';
import { ITemplatesResponse } from '@/models/ITemplatesResponse';
import { CardPreview } from '@/entity/CardPreview';

export class CardPreviewService {
  constructor(
    private cardsResponse: ICardsResponse[],
    private templatesResponse: ITemplatesResponse[],
  ) {}

  private cardUrl(cardId: string): string {
    return `/cards/${cardId}`;
  }

  private imageUrl(firstCardPageTemplateId: string): string {
    const template = this.templatesResponse.find(
      (templateResponse) => templateResponse.id === firstCardPageTemplateId,
    );
    return template?.imageUrl ?? '';
  }

  public generateCards(): CardPreview[] {
    return this.cardsResponse.reduce((acc, cardResponse) => {
      const card = this.generateCard(cardResponse);
      acc.push(card);
      return acc;
    }, [] as CardPreview[]);
  }

  public generateCard({ title, id, pages, sizes, basePrice }: ICardsResponse): CardPreview {
    const url = this.cardUrl(id);
    const imageUrl =  this.imageUrl(pages[0].templateId);
    return new CardPreview(title, imageUrl, url, sizes, pages, basePrice);
  }
}
