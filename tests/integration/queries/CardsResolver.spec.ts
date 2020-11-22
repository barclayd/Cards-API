import { ExecutionResult } from 'graphql';
import { setupGraphQL } from '../../helpers/setupGraphQL';
import { CARDS_QUERY } from '../../graphql/queries/cards';

describe('CardsResolver - cards', () => {
  let query: ExecutionResult;

  const cardsQuery = async () => {
    return await setupGraphQL({
      source: CARDS_QUERY,
    });
  };

  beforeEach(async () => {
    query = await cardsQuery();
  });

  it('returns the correct number of cards when executing cards query', async () => {
    expect(query.data?.cards).toHaveLength(3);
  });

  it('returns the correct cards when executing cards query', async () => {
    expect(query.data?.cards).toEqual([
      {
        title: 'card 1 title',
        imageUrl: '/front-cover-portrait-1.jpg',
        url: '/cards/card001',
      },
      {
        title: 'card 2 title',
        imageUrl: '/font-cover-portrait-2.jpg',
        url: '/cards/card002',
      },
      {
        title: 'card 3 title',
        imageUrl: '/front-cover-landscape.jpg',
        url: '/cards/card003',
      },
    ]);
  });
});
