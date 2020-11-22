import { CardPreviewService } from '@/services/CardPreviewService';
import { ICardsResponse } from '@/models/ICardsResponse';
import { ITemplatesResponse } from '@/models/ITemplatesResponse';
import rawCardsResponse from '@t/unit/data/cards.json';
import templatesResponse from '@t/unit/data/templates.json';
import { rawCardResponseToCardResponse } from '../helpers/util';
import { SizeOption } from '@/models/ISize';

const cardsResponse: ICardsResponse[] = rawCardResponseToCardResponse(rawCardsResponse);

describe('CardPreviewService', () => {
  let cardPreviewService: CardPreviewService;

  beforeEach(() => {
    buildService(cardsResponse, templatesResponse);
  });

  const buildService = (
    cardsResponse: ICardsResponse[],
    templatesResponse: ITemplatesResponse[],
  ) => {
    cardPreviewService = new CardPreviewService(
      cardsResponse,
      templatesResponse,
    );
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

  it('generates a card preview with the correct title', () => {
    const title = 'SOME TITLE';
    const response = generateICardsResponse(undefined, title);
    const cardPreview = cardPreviewService.generateCardPreview(response);
    expect(cardPreview.title).toEqual(title);
  });

  it('generates a card preview with the correct imageUrl when a template exists with the same id as firstCardPageTemplateId', () => {
    const firstCardPageTemplateId = 'template001';
    expect(templatesResponse.map((template) => template.id).includes(firstCardPageTemplateId)).toEqual(true);
    const response = generateICardsResponse(undefined, undefined, undefined, undefined, [
      {
        templateId: firstCardPageTemplateId,
        title: 'SOME TITLE',
      },
    ]);
    const cardPreview = cardPreviewService.generateCardPreview(response);
    const expectedImageUrl = templatesResponse.find(template => template.id === firstCardPageTemplateId)!.imageUrl;
    expect(cardPreview.imageUrl).toEqual(expectedImageUrl);
  });

  it('generates a card preview with the an imageUrl as an empty string when a template does not exists with same id as the firstCardPageTemplateId', () => {
    const firstCardPageTemplateId = 'template010';
    expect(templatesResponse.map((template) => template.id).includes(firstCardPageTemplateId)).toEqual(false);
    const response = generateICardsResponse(undefined, undefined, undefined, undefined, [
      {
        templateId: firstCardPageTemplateId,
        title: 'SOME TITLE',
      },
    ]);
    const cardPreview = cardPreviewService.generateCardPreview(response);
    expect(cardPreview.imageUrl).toEqual('');
  });

  it('generates a card preview with the correct card', () => {
    const id = 'SOME ID';
    const response = generateICardsResponse(id);
    const cardPreview = cardPreviewService.generateCardPreview(response);
    const expectedUrl = `/cards/${id}`;
    expect(cardPreview.url).toEqual(expectedUrl);
  });

  it('generates a card preview with the correct sizes', () => {
    const sizes: SizeOption[] = [SizeOption.sm, SizeOption.gt, SizeOption.lg];
    const response = generateICardsResponse(undefined, undefined, undefined, sizes);
    const cardPreview = cardPreviewService.generateCardPreview(response);
    expect(cardPreview.sizes).toEqual(sizes);
  });

  it('generates a card preview with the correct pages', () => {
    const pages = [
      {
        templateId: 'some template id',
        title: 'SOME TITLE',
      },
    ];
    const response = generateICardsResponse(undefined, undefined, undefined, undefined, pages);
    const cardPreview = cardPreviewService.generateCardPreview(response);
    expect(cardPreview.pages).toEqual(pages);
  });

  it('generates a card preview with the correct basePrice', () => {
    const basePrice = 100;
    const response = generateICardsResponse(undefined, undefined, basePrice, undefined, undefined);
    const cardPreview = cardPreviewService.generateCardPreview(response);
    expect(cardPreview.basePrice).toEqual(basePrice);
  });
});
