import { ICardsResponse } from '@/models/ICardsResponse';
import { ITemplatesResponse } from '@/models/ITemplatesResponse';
import { ISizesResponse } from '@/models/ISizesResponse';
import { CardPreview } from '@/entity/CardPreview';
import { CardPreviewService } from '@/services/CardPreviewService';
import { Card } from '@/entity/Card';
import { SizeOption } from '@/models/ISize';
import { ErrorMessage, QueryError } from '@/helpers/error';
import { SizeService } from '@/services/SizeService';
import { PageService } from '@/services/PageService';
import { PriceService } from '@/services/PriceService';

export class CardService {
  constructor(
    private cardsResponse: ICardsResponse[],
    private templatesResponse: ITemplatesResponse[],
    private sizesResponse: ISizesResponse[],
    private cardId: string,
    private size?: SizeOption,
  ) {}

  private createCardPreview(): CardPreview {
    const cardResponse = this.cardsResponse.find(
      (cardResponse) => cardResponse.id === this.cardId,
    );
    if (!cardResponse) {
      throw new QueryError(ErrorMessage.cardPreviewGeneration);
    }
    return new CardPreviewService(
      this.cardsResponse,
      this.templatesResponse,
    ).generateCardPreview(cardResponse);
  }

  public generateCard(): Card {
    const cardPreview = this.createCardPreview();
    const availableSizes = new SizeService(
      cardPreview.sizes,
      this.sizesResponse,
    ).availableSizes();
    const pages = new PageService(
      cardPreview,
      this.templatesResponse,
    ).generatePages();
    const price = new PriceService(
      cardPreview.basePrice,
      this.sizesResponse,
      this.size,
    ).calculatePrice();
    return new Card(
      cardPreview.title,
      cardPreview.imageUrl,
      cardPreview.url,
      cardPreview.sizes,
      cardPreview.pages,
      cardPreview.basePrice,
      availableSizes,
      pages,
      price,
      this.size,
    );
  }
}
