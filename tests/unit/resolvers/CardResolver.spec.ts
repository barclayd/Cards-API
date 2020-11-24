import { ICardResolverService } from '@/models/ICardResolverService';
import CardResolver from '@/resolvers/CardResolver';
import { SizeOption } from '@/models/ISize';
import { redisCacheService } from '@/services/cache/CacheService';

describe('CardResolver', () => {
  let resolver: CardResolver;

  afterAll(async () => {
    // workaround for https://github.com/luin/ioredis/issues/1088
    await redisCacheService.closeConnection();
  });

  const stubCardResolverService: ICardResolverService = {
    cards: jest.fn().mockResolvedValue({}) as any,
    card: jest.fn().mockResolvedValue({}) as any,
  };

  beforeEach(() => {
    resolver = new CardResolver(stubCardResolverService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('calls resolverService.cards when cards method is called', async () => {
    jest.spyOn(stubCardResolverService, 'cards');
    await resolver.cards();
    expect(stubCardResolverService.cards).toHaveBeenCalled();
  });

  it('calls resolverService.card when card method is called', async () => {
    jest.spyOn(stubCardResolverService, 'card');
    await resolver.card({
      cardId: 'card001',
    });
    expect(stubCardResolverService.card).toHaveBeenCalled();
  });

  it('calls resolverService.card with the correct parameters when card method is called', async () => {
    const cardId = 'someCardId';
    const size = SizeOption.sm;
    jest.spyOn(stubCardResolverService, 'card');
    const expectedParameters = {
      cardId,
      size,
    };
    await resolver.card(expectedParameters);
    expect(stubCardResolverService.card).toHaveBeenCalledWith(
      expectedParameters,
    );
  });
});
