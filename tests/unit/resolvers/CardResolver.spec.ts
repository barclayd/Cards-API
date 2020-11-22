import CardsResolver from '@/resolvers/CardsResolver';
import { INetwork } from '@/models/INetwork';
import { cardsResponse } from '../helpers/cardsResponse';
import { Endpoint } from '@/models/Endpoints';
import { CardPreview } from '@/entity/CardPreview';
import { CardPreviewService } from '@/services/CardPreviewService';

jest.mock('@/services/CardPreviewService', () => {
  const mockedCardPreviewServiceInstance = {
    generateCardPreviews: jest.fn().mockReturnValue([
      {
        title: 'title',
        imageUrl: 'imageUrl',
        url: 'url',
        sizes: [],
        pages: [],
        basePrice: 100,
      },
    ] as CardPreview[]),
    generateCardPreview: jest.fn(),
  };
  const mockedCardPreviewService = jest.fn(
    () => mockedCardPreviewServiceInstance,
  );
  return {
    CardPreviewService: mockedCardPreviewService,
  };
});

describe('CardResolver', () => {
  let resolver: CardsResolver;
  let networkStub: INetwork;

  const buildResolver = () => {
    resolver = new CardsResolver(networkStub);
  };

  beforeEach(() => {
    networkStub = {
      baseURL: 'some-url.com',
      get: jest.fn().mockReturnValue(cardsResponse) as any,
    };
    buildResolver();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('cards query', () => {
    it('calls networkService.get the correct number of times', async () => {
      await resolver.cards();
      expect(networkStub.get).toHaveBeenCalledTimes(2);
    });
    it('calls networkService with correct endpoints in the correct order', async () => {
      await resolver.cards();
      expect(networkStub.get).toHaveBeenNthCalledWith(1, Endpoint.cards);
      expect(networkStub.get).toHaveBeenNthCalledWith(2, Endpoint.templates);
    });
    it('calls cardPreviewService.generateCardPreviews method', async () => {
      const cardPreviewService = new CardPreviewService([], []);
      await resolver.cards();
      expect(cardPreviewService.generateCardPreviews).toHaveBeenCalledTimes(1);
    });
    it('returns a CardPreview', async () => {
      const cardPreviews = await resolver.cards();
      const cardPreviewKeys = Object.keys(
        new CardPreview('', '', '', [], [], 1),
      );
      const cardPreviewObject = cardPreviewKeys.reduce((acc, key) => {
        acc = {
          ...acc,
          [key]: expect.anything(),
        };
        return acc;
      }, {});
      cardPreviews.forEach((cardPreview) => {
        expect(cardPreview).toMatchObject(cardPreviewObject);
      });
    });
  });
  describe('card query', () => {
    it('calls networkService the correct number of times', () => {});
    it('calls networkService with the correct endpoints in the correct order', () => {});
    it('calls cardService.generateCard method', () => {});
    it('returns a Card', () => {});
  });
});
