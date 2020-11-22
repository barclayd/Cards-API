import { ExecutionResult } from 'graphql';
import { setupGraphQL } from '../../helpers/setupGraphQL';
import { CARDS_QUERY } from '../../graphql/queries/cards';

describe('CardsResolver - cards query', () => {
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

describe('CardsResolver - card query', () => {
  it("returns the correct data for cardId of 'card001' and size: 'gt'", () => {});
  it('returns a card with the correct size when size passed as an argument', () => {});
  it('returns a card with the correct size as null when size is not passed as an argument', () => {});
  it('returns a card with the correct price when size is passed as an argument', () => {});
  it('returns a card with the correct price when size is not passed as an argument', () => {});
});
