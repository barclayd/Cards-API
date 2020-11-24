import { Arg, Query, Resolver } from 'type-graphql';
import { CardPreview } from '@/entity/CardPreview';
import { INetwork } from '@/models/INetwork';
import { NetworkService } from '@/services/network/NetworkService';
import { ICardsResponse } from '@/models/ICardsResponse';
import { ITemplatesResponse } from '@/models/ITemplatesResponse';
import { Endpoint } from '@/models/Endpoints';
import { CardPreviewService } from '@/services/CardPreviewService';
import { Card } from '@/entity/Card';
import { CardInput } from '@/entity/CardInput';
import { ISizesResponse } from '@/models/ISizesResponse';
import { CardService } from '@/services/CardService';
import { redisCacheService } from '@/services/cache/CacheService';

const CACHE_TIME_TO_LIVE = 60 * 60 * 2;

@Resolver()
export default class CardsResolver {
  constructor(
    private networkService: INetwork = new NetworkService(
      process.env.DATABASE_URL!,
      redisCacheService,
      CACHE_TIME_TO_LIVE,
    ),
  ) {}

  @Query(() => [CardPreview])
  async cards() {
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

  @Query(() => Card)
  async card(@Arg('input', () => CardInput) input: CardInput) {
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
