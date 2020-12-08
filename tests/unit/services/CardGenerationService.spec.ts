import {ICardTemplate} from '@/models/ICardTemplate';
import {SizeOption} from '@/models/SizeOption';
import {Page} from '@/entity/Page'
import {cardObject} from '../../helpers/card'

describe('CardGenerationService', () => {
  let service: CardGenerationService

  const mockPage: Page = new Page('foo', 'bar', 100, 100, 'www.example.com')

  const mockICardTemplate: ICardTemplate = {
    id: 'testId',
    title: 'test title',
    sizes: [SizeOption.sm],
    basePrice: 1.00,
    pages: mockPage
  }

  beforeEach(() => {
    service = new CardGenerationService(mockICardTemplate)
  })

  it('returns a card when createCard is called', async () => {
    const createCard = await service.createCard()

    expect(createCard).toMatchObject(cardObject)
  })
})