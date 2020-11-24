import { ICardResolverService } from '@/models/ICardResolverService';
import { CardPreview } from '@/entity/CardPreview';
import { INetwork } from '@/models/INetwork';
import { NetworkService } from '@/services/network/NetworkService';
import { redisCacheService } from '@/services/cache/CacheService';
import { ICardsResponse } from '@/models/ICardsResponse';
import { Endpoint } from '@/models/Endpoints';
import { ITemplatesResponse } from '@/models/ITemplatesResponse';
import { CardPreviewService } from '@/services/CardPreviewService';
import { CardInput } from '@/entity/CardInput';
import { Card } from '@/entity/Card';
import { ISizesResponse } from '@/models/ISizesResponse';
import { CardService } from '@/services/CardService';

const CACHE_TIME_TO_LIVE = 60 * 60 * 2;

export class CardResolverService implements ICardResolverService {
  constructor(
    private networkService: INetwork = new NetworkService(
      process.env.DATABASE_URL!,
      redisCacheService,
      CACHE_TIME_TO_LIVE,
    ),
  ) {}

  public async cards(): Promise<CardPreview[]> {
    const cardsResponse = await this.networkService.get<ICardsResponse[]>(
      Endpoint.cards,
    );
    const templatesResponse = await this.networkService.get<
      ITemplatesResponse[]
    >(Endpoint.templates);

    return new CardPreviewService(
      cardsResponse,
      templatesResponse,
    ).generateCardPreviews();
  }

  public async card(input: CardInput): Promise<Card> {
    const cardsResponse = await this.networkService.get<ICardsResponse[]>(
      Endpoint.cards,
    );
    const templatesResponse = await this.networkService.get<
      ITemplatesResponse[]
    >(Endpoint.templates);
    const sizesResponse = await this.networkService.get<ISizesResponse[]>(
      Endpoint.sizes,
    );
    return new CardService(
      cardsResponse,
      templatesResponse,
      sizesResponse,
      input.cardId,
      input.size,
    ).generateCard();
  }
}
