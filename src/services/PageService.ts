import { CardPreview } from '@/entity/CardPreview';
import { Page } from '@/entity/Page';
import { ICardPagesResponse } from '@/models/ICardsResponse';
import { ITemplatesResponse } from '@/models/ITemplatesResponse';
import { ErrorMessage, QueryError } from '@/helpers/error';

export class PageService {
  constructor(
    private cardPreview: CardPreview,
    private templatesResponse: ITemplatesResponse[],
  ) {}

  private templateForId(templateId: string): ITemplatesResponse {
    const template = this.templatesResponse.find(
      (templateResponse) => templateResponse.id === templateId,
    );
    if (!template) {
      throw new QueryError(ErrorMessage.missingTemplateForCard);
    }
    return template;
  }

  private generatePage({ templateId, title }: ICardPagesResponse): Page {
    const { width, height, imageUrl } = this.templateForId(templateId);
    return new Page(templateId, title, width, height, imageUrl);
  }

  public generatePages(): Page[] {
    return this.cardPreview.pages.map((page) => this.generatePage(page));
  }
}
