import { ExecutionResult } from 'graphql';
import { setupGraphQL } from '@t/helpers/setupGraphQL';
import { CARD_QUERY, CARDS_QUERY } from '@t/graphql/queries/cards';
import { CardQueryInput } from '@t/models/CardQueryInput';
import { SizeOption } from '@/models/ISize';
import { QueryError } from '@/entity/QueryError';
import { ErrorMessage } from '@/models/ErrorMessage';
import { CacheService } from '@/services/CacheService';

describe('CardsResolver', () => {
  afterAll(async () => {
    await CacheService.shared.closeConnection();
  });

  describe('Cards Query', () => {
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

  describe('Card Query', () => {
    const cardQuery = async (variables: CardQueryInput) => {
      return await setupGraphQL({
        source: CARD_QUERY,
        variableValues: variables,
      });
    };

    it("returns the correct data for cardId of 'card001' and size: 'gt'", async () => {
      const expectedCard = {
        title: 'card 1 title',
        size: 'gt',
        availableSizes: [
          {
            id: 'sm',
            title: 'Small',
          },
          {
            id: 'md',
            title: 'Medium',
          },
          {
            id: 'gt',
            title: 'Giant',
          },
        ],
        imageUrl: '/front-cover-portrait-1.jpg',
        price: '£4.00',
        pages: [
          {
            title: 'Front Cover',
            width: 300,
            height: 600,
            imageUrl: '/front-cover-portrait-1.jpg',
          },
          {
            title: 'Inside Left',
            width: 300,
            height: 600,
            imageUrl: '',
          },
          {
            title: 'Inside Right',
            width: 300,
            height: 600,
            imageUrl: '',
          },
          {
            title: 'Back Cover',
            width: 300,
            height: 600,
            imageUrl: '/back-cover-portrait.jpg',
          },
        ],
      };

      const card = await cardQuery({ id: 'card001', size: SizeOption.gt });
      expect(card?.data?.card).toEqual(expectedCard);
    });
    it('returns a card with the correct size when size passed as an argument', async () => {
      const size = SizeOption.sm;
      const card = await cardQuery({ id: 'card001', size });
      expect(card?.data?.card.size).toEqual(size);
    });
    it('returns a card with a size of null when size is not passed as an argument', async () => {
      const card = await cardQuery({ id: 'card001' });
      expect(card?.data?.card.size).toBe(null);
    });
    it('returns a card with the correct price when size is passed as an argument', async () => {
      const card = await cardQuery({ id: 'card002', size: SizeOption.lg });
      const expectedPrice = '£2.80';
      expect(card?.data?.card.price).toEqual(expectedPrice);
    });
    it('returns a card with the correct price when size is not passed as an argument', async () => {
      const card = await cardQuery({ id: 'card002' });
      const expectedPrice = '£2.00';
      expect(card?.data?.card.price).toEqual(expectedPrice);
    });
    it('returns an error when an invalid id is passed as an argument', async () => {
      const { errors } = await cardQuery({ id: 'someInvalidId' });
      expect(errors).toHaveLength(1);
    });
    it('returns the correct error when an invalid id is passed as an argument', async () => {
      const { errors } = await cardQuery({ id: 'someInvalidId' });
      const expectedError = new QueryError(ErrorMessage.cardPreviewGeneration);
      expect(errors![0]).toEqual(expectedError);
    });
  });
});
