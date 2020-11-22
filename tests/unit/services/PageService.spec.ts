import { PageService } from '@/services/PageService';
import { CardPreview } from '@/entity/CardPreview';
import { ITemplatesResponse } from '@/models/ITemplatesResponse';
import templatesResponse from '@t/unit/data/templates.json';
import { generateCardPreview } from '../helpers/cardPreview';
import { ICardPagesResponse } from '@/models/ICardsResponse';
import { ErrorMessage, QueryError } from '@/helpers/error';

describe('PageService', () => {
  let service: PageService;

  const buildService = (
    cardPreview: CardPreview,
    templatesResponse: ITemplatesResponse[],
  ) => {
    service = new PageService(cardPreview, templatesResponse);
  };

  beforeEach(() => {
    buildService(generateCardPreview(), templatesResponse);
  });

  describe('when generatePages is called', () => {
    it('calls generatePage the same number as times as there are cardPreview.pages', () => {
      const pages: ICardPagesResponse[] = [
        {
          templateId: '001',
          title: 'title1',
        },
        {
          templateId: '002',
          title: 'title2',
        },
      ];
      const cardPreview = generateCardPreview(
        undefined,
        undefined,
        undefined,
        undefined,
        pages,
      );
      buildService(cardPreview, templatesResponse);
      const mockGeneratePage = jest.fn();
      jest
        .spyOn(service as any, 'generatePage')
        .mockImplementation(mockGeneratePage);
      service.generatePages();
      const expectedNumberOfTimesToBeCalled = pages.length;
      expect(mockGeneratePage).toBeCalledTimes(expectedNumberOfTimesToBeCalled);
    });

    it('returns the correct pages for the cardPreview.pages provided', () => {
      const cardPreviewPages: ICardPagesResponse[] = [
        {
          templateId: 'template001',
          title: 'title1',
        },
        {
          templateId: 'template004',
          title: 'title2',
        },
        {
          templateId: 'template008',
          title: 'title2',
        },
      ];
      const cardPreview = generateCardPreview(
        undefined,
        undefined,
        undefined,
        undefined,
        cardPreviewPages,
      );
      buildService(cardPreview, templatesResponse);
      const pages = service.generatePages();
      const expectedPages = [
        {
          templateId: 'template001',
          title: 'title1',
          width: 300,
          height: 600,
          imageUrl: '/front-cover-portrait-1.jpg',
        },
        {
          templateId: 'template004',
          title: 'title2',
          width: 300,
          height: 600,
          imageUrl: '/back-cover-portrait.jpg',
        },
        {
          templateId: 'template008',
          title: 'title2',
          width: 600,
          height: 300,
          imageUrl: '/back-cover-landscape.jpg',
        },
      ];
      expect(pages).toEqual(expectedPages);
    });

    it('throws an error when a cardPreview page has a templateId which does not exist as an id within templatesResponse', () => {
      const templateId = 'someTemplateIdThatDoesNotExist';
      const cardPreviewPages: ICardPagesResponse[] = [
        {
          templateId,
          title: 'title1',
        },
      ];
      const cardPreview = generateCardPreview(
        undefined,
        undefined,
        undefined,
        undefined,
        cardPreviewPages,
      );
      expect(
        templatesResponse.find(
          (templateResponse) => templateResponse.id === templateId,
        ),
      ).toBeUndefined();
      buildService(cardPreview, templatesResponse);
      expect(() => {
        service.generatePages();
      }).toThrow();
    });

    it('throws the correct error when a cardPreview page has a templateId which does not exist as an id within templatesResponse', () => {
      const templateId = 'someTemplateIdThatDoesNotExist';
      const cardPreviewPages: ICardPagesResponse[] = [
        {
          templateId,
          title: 'title1',
        },
      ];
      const cardPreview = generateCardPreview(
        undefined,
        undefined,
        undefined,
        undefined,
        cardPreviewPages,
      );
      expect(
        templatesResponse.find(
          (templateResponse) => templateResponse.id === templateId,
        ),
      ).toBeUndefined();
      buildService(cardPreview, templatesResponse);
      const expectedError = new QueryError(ErrorMessage.missingTemplateForCard);
      expect(() => {
        service.generatePages();
      }).toThrowError(expectedError);
    });
  });
});
