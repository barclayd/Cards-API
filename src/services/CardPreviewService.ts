import { ICardResponse } from '@/models/ICardResponse';
import { ITemplatesResponse } from '@/models/ITemplatesResponse';
import { CardPreview } from '@/entity/CardPreview';

export class CardPreviewService {
  constructor(
    private cardsResponse: ICardResponse[],
    private templatesResponse: ITemplatesResponse[],
  ) {}

  private cardUrl(cardId: string): string {
    return `/cards/${cardId}`;
  }

  private imageUrl(firstCardPageTemplateId?: string): string {
    const fallback = '';
    if (!firstCardPageTemplateId) {
      return fallback;
    }
    const template = this.templatesResponse.find(
      (templateResponse) => templateResponse.id === firstCardPageTemplateId,
    );
    return template?.imageUrl ?? fallback;
  }

  public generateCardPreviews(): CardPreview[] {
    return this.cardsResponse.reduce((acc, cardResponse) => {
      const card = this.generateCardPreview(cardResponse);
      acc.push(card);
      return acc;
    }, [] as CardPreview[]);
  }

  public generateCardPreview({
    title,
    id,
    pages,
    sizes,
    basePrice,
  }: ICardResponse): CardPreview {
    const url = this.cardUrl(id);
    const imageUrl = this.imageUrl(pages[0]?.templateId);
    return new CardPreview(title, imageUrl, url, sizes, pages, basePrice);
  }
}
