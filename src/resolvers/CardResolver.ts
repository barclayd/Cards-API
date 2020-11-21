import { Query, Resolver } from 'type-graphql';
import { Card } from '@/entity/Card';
import { INetwork } from '@/models/INetwork';
import { NetworkService } from '@/services/NetworkService';
import { ICardsResponse } from '@/models/ICardsResponse';
import { ITemplatesResponse } from '@/models/ITemplatesResponse';
import { Endpoint } from '@/models/Endpoints';
import { CardService } from '@/services/CardService';

@Resolver()
export default class CardResolver {
  constructor(
    private networkService: INetwork = new NetworkService(
      process.env.DATABASE_URL!,
    ),
  ) {}

  @Query(() => [Card])
  async cards() {
    const cardsResponse = await this.networkService.get<
      ICardsResponse[]
    >(Endpoint.cards);
    const templatesResponse = await this.networkService.get<
      ITemplatesResponse[]
    >(Endpoint.templates);

    return new CardService(cardsResponse, templatesResponse).generateCards();
  }
}
