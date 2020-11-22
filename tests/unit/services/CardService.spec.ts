import { CardService } from '@/services/CardService';
import { ICardsResponse } from '@/models/ICardsResponse';
import { ITemplatesResponse } from '@/models/ITemplatesResponse';
import { ISizesResponse } from '@/models/ISizesResponse';
import { SizeOption } from '@/models/ISize';
import { cardsResponse } from '../helpers/cardsResponse';
import templatesResponse from '@t/unit/data/templates.json';
import { sizesResponse } from '../helpers/sizesResponse';
import { generateCardPreview } from '../helpers/cardPreview';
import { QueryError } from '@/entity/QueryError';
import { ErrorMessage } from '@/models/ErrorMessage';
import { SizeService } from '@/services/SizeService';
import { PageService } from '@/services/PageService';
import { CardPreviewService } from '@/services/CardPreviewService';
import { CardPreview } from '@/entity/CardPreview';
import { PriceService } from '@/services/PriceService';
import { cardObject } from '../helpers/card';

jest.mock('@/services/CardPreviewService', () => {
  const mockedCardPreviewServiceInstance = {
    generateCardPreviews: jest.fn(),
    generateCardPreview: jest.fn().mockReturnValue({
      title: 'title',
      imageUrl: 'imageUrl',
      url: 'url',
      sizes: [],
      pages: [],
      basePrice: 100,
    } as CardPreview),
  };
  const mockedCardPreviewService = jest.fn(
    () => mockedCardPreviewServiceInstance,
  );
  return {
    CardPreviewService: mockedCardPreviewService,
  };
});

jest.mock('@/services/SizeService', () => {
  const mockedSizeServiceInstance = {
    availableSizes: jest.fn().mockReturnValue([]),
  };
  const mockedSizeService = jest.fn(() => mockedSizeServiceInstance);
  return {
    SizeService: mockedSizeService,
  };
});

jest.mock('@/services/PageService', () => {
  const mockedPageServiceInstance = {
    generatePages: jest.fn().mockReturnValue([]),
  };
  const mockedPageService = jest.fn(() => mockedPageServiceInstance);
  return {
    PageService: mockedPageService,
  };
});

jest.mock('@/services/PriceService', () => {
  const mockedPriceServiceInstance = {
    calculatePrice: jest.fn().mockReturnValue(100),
  };
  const mockedPriceService = jest.fn(() => mockedPriceServiceInstance);
  return {
    PriceService: mockedPriceService,
  };
});

describe('CardService', () => {
  let service: CardService;

  const buildService = (
    cardsResponse: ICardsResponse[],
    templatesResponse: ITemplatesResponse[],
    sizesResponse: ISizesResponse[],
    cardId: string,
    size?: SizeOption,
  ) => {
    service = new CardService(
      cardsResponse,
      templatesResponse,
      sizesResponse,
      cardId,
      size,
    );
  };

  beforeEach(() => {
    buildService(
      cardsResponse,
      templatesResponse,
      sizesResponse,
      'card001',
      SizeOption.gt,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generateCard', () => {
    it('calls createCardPreview', () => {
      const mockCreateCardPreview = jest
        .fn()
        .mockReturnValue(generateCardPreview());
      jest
        .spyOn(service as any, 'createCardPreview')
        .mockImplementation(mockCreateCardPreview);
      service.generateCard();
      expect(mockCreateCardPreview).toHaveBeenCalled();
    });

    it('throws an error when cardId provided does not exist within cardResponse ids', () => {
      const cardId = 'cardIdThatDoesNotExistInCardsResponse';
      buildService(
        cardsResponse,
        templatesResponse,
        sizesResponse,
        cardId,
        SizeOption.gt,
      );
      expect(
        cardsResponse.find((cardsResponse) => cardsResponse.id === cardId),
      ).toBeUndefined();
      expect(() => {
        service.generateCard();
      }).toThrow();
    });

    it('throws the correct error when cardId provided does not exist within cardResponse ids', () => {
      const cardId = 'cardIdThatDoesNotExistInCardsResponse';
      buildService(
        cardsResponse,
        templatesResponse,
        sizesResponse,
        cardId,
        SizeOption.gt,
      );
      expect(
        cardsResponse.find((cardsResponse) => cardsResponse.id === cardId),
      ).toBeUndefined();
      const expectedError = new QueryError(ErrorMessage.cardPreviewGeneration);
      expect(() => {
        service.generateCard();
      }).toThrowError(expectedError);
    });

    it('calls sizeService.availableSizes method', () => {
      const sizeService = new SizeService([], []);
      service.generateCard();
      expect(sizeService.availableSizes).toHaveBeenCalledTimes(1);
    });

    it('calls cardPreviewService.generateCardPreview method', () => {
      const cardPreviewService = new CardPreviewService([], []);
      service.generateCard();
      expect(cardPreviewService.generateCardPreview).toHaveBeenCalledTimes(1);
    });

    it('calls cardPreviewService.generateCardPreview method with the correct argument', () => {
      const cardPreviewService = new CardPreviewService([], []);
      service.generateCard();
      const expectedArgument = {
        id: 'card001',
        title: 'card 1 title',
        sizes: ['sm', 'md', 'gt'],
        basePrice: 200,
        pages: [
          { title: 'Front Cover', templateId: 'template001' },
          { title: 'Inside Left', templateId: 'template002' },
          { title: 'Inside Right', templateId: 'template003' },
          { title: 'Back Cover', templateId: 'template004' },
        ],
      } as ICardsResponse;
      expect(cardPreviewService.generateCardPreview).toHaveBeenCalledWith(
        expectedArgument,
      );
    });

    it('calls pageService.generatePages method', () => {
      const sizeService = new PageService(
        generateCardPreview(),
        templatesResponse,
      );
      service.generateCard();
      expect(sizeService.generatePages).toHaveBeenCalledTimes(1);
    });

    it('calls priceService.calculatePrice method', () => {
      const priceService = new PriceService(100, []);
      service.generateCard();
      expect(priceService.calculatePrice).toHaveBeenCalledTimes(1);
    });

    it('returns a Card', () => {
      const card = service.generateCard();
      expect(card).toMatchObject(cardObject);
    });
  });
});
