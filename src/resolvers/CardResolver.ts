import { Arg, Query, Resolver } from 'type-graphql';
import { CardPreview } from '@/entity/CardPreview';
import { Card } from '@/entity/Card';
import { CardInput } from '@/entity/CardInput';
import { ICardResolverService } from '@/models/ICardResolverService';
import { CardResolverService } from '@/services/CardResolverService';

@Resolver()
export default class CardResolver {
  constructor(
    private resolverService: ICardResolverService = new CardResolverService(),
  ) {}

  @Query(() => [CardPreview])
  async cards() {
    return this.resolverService.cards();
  }

  @Query(() => Card)
  async card(@Arg('input', () => CardInput) input: CardInput) {
    return this.resolverService.card(input);
  }
}
