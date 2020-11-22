import CardsResolver from '@/resolvers/CardsResolver';
import { INetwork } from '@/models/INetwork';
import { cardsResponse } from '../helpers/cardsResponse';
import { Endpoint } from '@/models/Endpoints';
import { CardPreview } from '@/entity/CardPreview';
import { CardPreviewService } from '@/services/CardPreviewService';
import { Card } from '@/entity/Card';
import { Size } from '@/entity/Size';
import { CardService } from '@/services/CardService';
import { sizesResponse } from '../helpers/sizesResponse';
import templateResponse from '../data/templates.json';
import { cardObject } from '../helpers/card';
import { SizeOption } from '@/models/ISize';

const endpointResourceMap = new Map<Endpoint, any>([
  [Endpoint.sizes, sizesResponse],
  [Endpoint.templates, templateResponse],
  [Endpoint.cards, cardsResponse],
]);

jest.mock('@/services/CardPreviewService', () => {
  const mockedCardPreviewServiceInstance = {
    generateCardPreviews: jest.fn().mockReturnValue([
      {
        title: 'title',
        imageUrl: 'imageUrl',
        url: 'url',
        sizes: ['md'],
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

jest.mock('@/services/CardService', () => {
  const mockedCardServiceInstance = {
    generateCard: jest.fn().mockReturnValue({
      title: 'title',
      imageUrl: 'imageUrl',
      url: 'url',
      pages: [],
      basePrice: 100,
      availableSizes: [
        {
          title: 'Medium',
          id: 'md',
        },
      ] as Size[],
      size: 'sm',
      sizes: ['md'],
      price: '£2.60',
    } as Card),
  };
  const mockedCardService = jest.fn(() => mockedCardServiceInstance);
  return {
    CardService: mockedCardService,
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
    it('calls networkService the correct number of times', async () => {
      try {
        await resolver.card({
          cardId: 'someCardId',
        });
      } catch (e) {}
      expect(networkStub.get).toHaveBeenCalledTimes(3);
    });
    it('calls networkService with the correct endpoints in the correct order', async () => {
      try {
        await resolver.card({
          cardId: 'someCardId',
        });
      } catch (e) {}
      expect(networkStub.get).toHaveBeenNthCalledWith(1, Endpoint.cards);
      expect(networkStub.get).toHaveBeenNthCalledWith(2, Endpoint.templates);
      expect(networkStub.get).toHaveBeenNthCalledWith(3, Endpoint.sizes);
    });
    it('calls cardService.generateCard method', async () => {
      const cardService = new CardService([], [], [], 'someId');
      await resolver.card({
        cardId: 'someCardId',
      });
      expect(cardService.generateCard).toHaveBeenCalledTimes(1);
    });
    it('returns a Card', async () => {
      networkStub = {
        baseURL: 'some-url.com',
        get: (endpoint) => {
          return endpointResourceMap.get(endpoint);
        },
      };
      buildResolver();
      const card = await resolver.card({
        cardId: 'card001',
        sizeId: SizeOption.md,
      });
      expect(card).toMatchObject(cardObject);
    });
  });
});
