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

  private createCardPreview(): CardPreview | undefined {
    const cardResponse = this.cardsResponse.find(
      (cardResponse) => cardResponse.id === this.cardId,
    );
    if (!cardResponse) {
      return;
    }
    return new CardPreviewService(
      this.cardsResponse,
      this.templatesResponse,
    ).generateCard(cardResponse);
  }

  public generateDetailedCard(): Card {
    const cardPreview = this.createCardPreview();
    if (!cardPreview) {
      throw new QueryError(ErrorMessage.detailedCardGeneration);
    }
    const availableSizes = new SizeService(
      cardPreview.sizes,
      this.sizesResponse,
    ).availableSizes();
    const pages = new PageService(
      cardPreview,
      this.templatesResponse,
    ).generatePages();
    const price = new PriceService(cardPreview.basePrice, this.sizesResponse, this.size).calculate();
    return {
      ...cardPreview,
      size: this.size,
      availableSizes,
      price,
      pages,
    };
  }
}
