import { CardService } from '@/services/CardService';
import { ICardsResponse } from '@/models/ICardsResponse';
import { ITemplatesResponse } from '@/models/ITemplatesResponse';
import { ISizesResponse } from '@/models/ISizesResponse';
import { SizeOption } from '@/models/ISize';
import { cardsResponse } from '@t/unit/helpers/cardsResponse';
import { sizesResponse } from '@t/unit/helpers/sizesResponse';
import templatesResponse from '@t/unit/data/templates.json';
import { Card } from '@/entity/Card';
import { Page } from '@/entity/Page';

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

  describe('generateCard', () => {
    describe('when a size is provided', () => {
      it('returns the expected card for the provided cardId', () => {
        const card = service.generateCard();
        const expectedCard: Card = {
          title: 'card 1 title',
          imageUrl: '/front-cover-portrait-1.jpg',
          url: '/cards/card001',
          sizes: [SizeOption.sm, SizeOption.md, SizeOption.gt],
          pages: [
            {
              templateId: 'template001',
              title: 'Front Cover',
              width: 300,
              height: 600,
              imageUrl: '/front-cover-portrait-1.jpg',
            },
            {
              templateId: 'template002',
              title: 'Inside Left',
              width: 300,
              height: 600,
              imageUrl: '',
            },
            {
              templateId: 'template003',
              title: 'Inside Right',
              width: 300,
              height: 600,
              imageUrl: '',
            },
            {
              templateId: 'template004',
              title: 'Back Cover',
              width: 300,
              height: 600,
              imageUrl: '/back-cover-portrait.jpg',
            },
          ],
          basePrice: 200,
          availableSizes: [
            { id: 'sm', title: 'Small' },
            { id: 'md', title: 'Medium' },
            { id: 'gt', title: 'Giant' },
          ],
          price: '£4.00',
          size: SizeOption.gt,
        };

        expect(card).toEqual(expectedCard);
      });

      it('returns a card with the correct price', () => {
        const { price } = service.generateCard();
        expect(price).toEqual('£4.00');
      });

      it('returns a card with the correct size', () => {
        const size = SizeOption.md;
        buildService(
          cardsResponse,
          templatesResponse,
          sizesResponse,
          'card001',
          size,
        );
        const card = service.generateCard();
        expect(card.size).toEqual(size);
      });

      it('returns a card with the correct pages', () => {
        const { pages } = service.generateCard();
        const expectedPages: Page[] = [
          {
            templateId: 'template001',
            title: 'Front Cover',
            width: 300,
            height: 600,
            imageUrl: '/front-cover-portrait-1.jpg',
          },
          {
            templateId: 'template002',
            title: 'Inside Left',
            width: 300,
            height: 600,
            imageUrl: '',
          },
          {
            templateId: 'template003',
            title: 'Inside Right',
            width: 300,
            height: 600,
            imageUrl: '',
          },
          {
            templateId: 'template004',
            title: 'Back Cover',
            width: 300,
            height: 600,
            imageUrl: '/back-cover-portrait.jpg',
          },
        ];
        expect(pages).toEqual(expectedPages);
      });

      it('returns a card with the sizes', () => {
        const { sizes } = service.generateCard();
        const expectedSizes: SizeOption[] = [
          SizeOption.sm,
          SizeOption.md,
          SizeOption.gt,
        ];
        expect(sizes).toEqual(expectedSizes);
      });
    });

    describe('when a size is not provided', () => {
      it('returns the expected card', () => {
        buildService(
          cardsResponse,
          templatesResponse,
          sizesResponse,
          'card001',
        );
        const card = service.generateCard();
        const expectedCard = {
          title: 'card 1 title',
          imageUrl: '/front-cover-portrait-1.jpg',
          url: '/cards/card001',
          sizes: ['sm', 'md', 'gt'],
          pages: [
            {
              templateId: 'template001',
              title: 'Front Cover',
              width: 300,
              height: 600,
              imageUrl: '/front-cover-portrait-1.jpg',
            },
            {
              templateId: 'template002',
              title: 'Inside Left',
              width: 300,
              height: 600,
              imageUrl: '',
            },
            {
              templateId: 'template003',
              title: 'Inside Right',
              width: 300,
              height: 600,
              imageUrl: '',
            },
            {
              templateId: 'template004',
              title: 'Back Cover',
              width: 300,
              height: 600,
              imageUrl: '/back-cover-portrait.jpg',
            },
          ],
          basePrice: 200,
          availableSizes: [
            { id: 'sm', title: 'Small' },
            { id: 'md', title: 'Medium' },
            { id: 'gt', title: 'Giant' },
          ],
          price: '£2.00',
        };
        expect(card).toEqual(expectedCard);
      });

      it('returns a card which size is undefined', () => {
        buildService(
          cardsResponse,
          templatesResponse,
          sizesResponse,
          'card001',
        );
        const card = service.generateCard();
        expect(card.size).toBeUndefined();
      });

      it('returns a card with the correct price', () => {
        buildService(
          cardsResponse,
          templatesResponse,
          sizesResponse,
          'card001',
        );
        const { price } = service.generateCard();
        expect(price).toEqual('£2.00');
      });
    });
  });
});
