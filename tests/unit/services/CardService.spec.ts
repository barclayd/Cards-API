import { CardService } from '@/services/CardService';
import { ICardsResponse } from '@/models/ICardsResponse';
import { ITemplatesResponse } from '@/models/ITemplatesResponse';
import { ISizesResponse } from '@/models/ISizesResponse';
import { SizeOption } from '@/models/ISize';
import { cardsResponse } from '../helpers/cardsResponse';
import templatesResponse from '@t/unit/data/templates.json';
import { sizesResponse } from '../helpers/sizesResponse';
import { generateCardPreview } from '../helpers/cardPreview';
import { ErrorMessage, QueryError } from '@/helpers/error';
import { SizeService } from '@/services/SizeService';
import { PageService } from '@/services/PageService';

jest.mock('@/services/SizeService', () => {
  const mockedSizeServiceInstance = { availableSizes: jest.fn() };
  const mockedSizeService = jest.fn(() => mockedSizeServiceInstance);
  return {
    SizeService: mockedSizeService,
  };
});

jest.mock('@/services/PageService', () => {
  const mockedPageServiceInstance = { generatePages: jest.fn() };
  const mockedPageService = jest.fn(() => mockedPageServiceInstance);
  return {
    PageService: mockedPageService,
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
      expect(sizeService.availableSizes).toBeCalledTimes(1);
    });

    it('calls pageService.generatePages method', () => {
      const sizeService = new PageService(
        generateCardPreview(),
        templatesResponse,
      );
      service.generateCard();
      expect(sizeService.generatePages).toBeCalledTimes(1);
    });
  });
});
