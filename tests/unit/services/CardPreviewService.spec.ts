import { CardPreviewService } from '@/services/CardPreviewService';
import { ICardsResponse } from '@/models/ICardsResponse';
import { ITemplatesResponse } from '@/models/ITemplatesResponse';
import rawCardsResponse from '@t/unit/data/cards.json';
import templatesResponse from '@t/unit/data/templates.json';
import { rawCardResponseToCardResponse } from '../helpers/util';
import { SizeOption } from '@/models/ISize';
import { CardPreview } from '../../../src/entity/CardPreview';

const cardsResponse: ICardsResponse[] = rawCardResponseToCardResponse(
  rawCardsResponse,
);

describe('CardPreviewService', () => {
  let service: CardPreviewService;

  beforeEach(() => {
    buildService(cardsResponse, templatesResponse);
  });

  const buildService = (
    cardsResponse: ICardsResponse[],
    templatesResponse: ITemplatesResponse[],
  ) => {
    service = new CardPreviewService(cardsResponse, templatesResponse);
  };

  const generateICardsResponse = (
    id: string = '001',
    title: string = 'SOME TITLE',
    basePrice: number = 100,
    sizes: SizeOption[] = [SizeOption.lg, SizeOption.gt, SizeOption.sm],
    pages = [
      {
        title: 'title',
        templateId: '001',
      },
    ],
  ): ICardsResponse => {
    return {
      id,
      title,
      basePrice,
      sizes,
      pages,
    };
  };

  describe('generateCardPreview', () => {
    it('generates a card preview with the correct title', () => {
      const title = 'SOME TITLE';
      const response = generateICardsResponse(undefined, title);
      const cardPreview = service.generateCardPreview(response);
      expect(cardPreview.title).toEqual(title);
    });

    it('generates a card preview with the correct imageUrl when a template exists with the same id as firstCardPageTemplateId', () => {
      const firstCardPageTemplateId = 'template001';
      expect(
        templatesResponse
          .map((template) => template.id)
          .includes(firstCardPageTemplateId),
      ).toEqual(true);
      const response = generateICardsResponse(
        undefined,
        undefined,
        undefined,
        undefined,
        [
          {
            templateId: firstCardPageTemplateId,
            title: 'SOME TITLE',
          },
        ],
      );
      const cardPreview = service.generateCardPreview(response);
      const expectedImageUrl = templatesResponse.find(
        (template) => template.id === firstCardPageTemplateId,
      )!.imageUrl;
      expect(cardPreview.imageUrl).toEqual(expectedImageUrl);
    });

    it('generates a card preview with the an imageUrl as an empty string when a template does not exists with same id as the firstCardPageTemplateId', () => {
      const firstCardPageTemplateId = 'template010';
      expect(
        templatesResponse
          .map((template) => template.id)
          .includes(firstCardPageTemplateId),
      ).toEqual(false);
      const response = generateICardsResponse(
        undefined,
        undefined,
        undefined,
        undefined,
        [
          {
            templateId: firstCardPageTemplateId,
            title: 'SOME TITLE',
          },
        ],
      );
      const cardPreview = service.generateCardPreview(response);
      expect(cardPreview.imageUrl).toEqual('');
    });

    it('generates a card preview with the an imageUrl as an empty string when cardResponse pages is an empty array', () => {
      const response = generateICardsResponse(
        undefined,
        undefined,
        undefined,
        undefined,
        [],
      );
      const cardPreview = service.generateCardPreview(response);
      expect(cardPreview.imageUrl).toEqual('');
    });

    it('generates a card preview with the correct card', () => {
      const id = 'SOME ID';
      const response = generateICardsResponse(id);
      const cardPreview = service.generateCardPreview(response);
      const expectedUrl = `/cards/${id}`;
      expect(cardPreview.url).toEqual(expectedUrl);
    });

    it('generates a card preview with the correct sizes', () => {
      const sizes: SizeOption[] = [SizeOption.sm, SizeOption.gt, SizeOption.lg];
      const response = generateICardsResponse(
        undefined,
        undefined,
        undefined,
        sizes,
      );
      const cardPreview = service.generateCardPreview(response);
      expect(cardPreview.sizes).toEqual(sizes);
    });

    it('generates a card preview with the correct pages', () => {
      const pages = [
        {
          templateId: 'some template id',
          title: 'SOME TITLE',
        },
      ];
      const response = generateICardsResponse(
        undefined,
        undefined,
        undefined,
        undefined,
        pages,
      );
      const cardPreview = service.generateCardPreview(response);
      expect(cardPreview.pages).toEqual(pages);
    });

    it('generates a card preview with the correct basePrice', () => {
      const basePrice = 100;
      const response = generateICardsResponse(
        undefined,
        undefined,
        basePrice,
        undefined,
        undefined,
      );
      const cardPreview = service.generateCardPreview(response);
      expect(cardPreview.basePrice).toEqual(basePrice);
    });

    it('calls cardUrl when generatingCardPreview', () => {
      const response = generateICardsResponse();
      const mockCardUrl = jest.fn();
      jest.spyOn(service as any, 'cardUrl').mockImplementation(mockCardUrl);
      service.generateCardPreview(response);
      expect(mockCardUrl).toHaveBeenCalled();
    });

    it('calls cardUrl when generatingCardPreview with the id', () => {
      const id = '100';
      const response = generateICardsResponse(id);
      const mockCardUrl = jest.fn();
      jest.spyOn(service as any, 'cardUrl').mockImplementation(mockCardUrl);
      service.generateCardPreview(response);
      expect(mockCardUrl).toHaveBeenCalledWith(id);
    });

    it('calls imageUrl when generatingCardPreview', () => {
      const id = '100';
      const response = generateICardsResponse(id);
      const mockImageUrl = jest.fn();
      jest.spyOn(service as any, 'imageUrl').mockImplementation(mockImageUrl);
      service.generateCardPreview(response);
      expect(mockImageUrl).toHaveBeenCalled();
    });

    it('calls imageUrl when generatingCardPreview with the correct parameter', () => {
      const pages = [
        {
          templateId: 'some template id',
          title: 'SOME TITLE',
        },
      ];
      const response = generateICardsResponse(
        undefined,
        undefined,
        undefined,
        undefined,
        pages,
      );
      const mockImageUrl = jest.fn();
      jest.spyOn(service as any, 'imageUrl').mockImplementation(mockImageUrl);
      service.generateCardPreview(response);
      const expectedParameter = pages[0].templateId;
      expect(mockImageUrl).toHaveBeenCalledWith(expectedParameter);
    });
  });

  describe('generateCardPreviews', () => {
    it('calls generateCardPreview the same number of times as there are cardResponses', () => {
      const response1 = generateICardsResponse();
      const response2 = generateICardsResponse();
      const response3 = generateICardsResponse();
      const responses = [response1, response2, response3];
      buildService(responses, templatesResponse);
      const mockGenerateCardPreview = jest.fn();
      jest
        .spyOn(service, 'generateCardPreview')
        .mockImplementation(mockGenerateCardPreview);
      service.generateCardPreviews();
      const expectedNumberOfCalls = responses.length;
      expect(mockGenerateCardPreview).toBeCalledTimes(expectedNumberOfCalls);
    });

    it('returns the correct response when generateCardPreviews is called', () => {
      const response1 = generateICardsResponse('001');
      const response2 = generateICardsResponse('002');
      const response3 = generateICardsResponse('003');
      const responses = [response1, response2, response3];
      buildService(responses, templatesResponse);
      const expectedCardPreviews: CardPreview[] = [
        {
          title: 'SOME TITLE',
          imageUrl: '',
          url: '/cards/001',
          sizes: [SizeOption.lg, SizeOption.gt, SizeOption.sm],
          pages: [{ title: 'title', templateId: '001' }],
          basePrice: 100,
        },
        {
          title: 'SOME TITLE',
          imageUrl: '',
          url: '/cards/002',
          sizes: [SizeOption.lg, SizeOption.gt, SizeOption.sm],
          pages: [{ title: 'title', templateId: '001' }],
          basePrice: 100,
        },
        {
          title: 'SOME TITLE',
          imageUrl: '',
          url: '/cards/003',
          sizes: [SizeOption.lg, SizeOption.gt, SizeOption.sm],
          pages: [{ title: 'title', templateId: '001' }],
          basePrice: 100,
        },
      ];
      const cardPreviews = service.generateCardPreviews();
      expect(cardPreviews).toEqual(expectedCardPreviews);
    });

    it('returns an empty array of cardPreviews when cardResponses is an empty array', () => {
      buildService([], templatesResponse);
      const cardPreviews = service.generateCardPreviews();
      expect(cardPreviews).toEqual([]);
    });
  });
});
