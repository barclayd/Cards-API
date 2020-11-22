import { SizeOption } from '@/models/ISize';
import { ICardsRawResponse } from '../models/ICardRawResponse';
import { ICardsResponse } from '../../../src/models/ICardsResponse';

export const convertSizeStringToSizeOption = (
  sizeString: string,
): SizeOption => {
  return (<any>SizeOption)[sizeString];
};

export const rawCardResponseToCardResponse = (
  rawCardsResponse: ICardsRawResponse[],
): ICardsResponse[] => {
  return rawCardsResponse.map(
    (rawCard) =>
      ({
        ...rawCard,
        sizes: rawCard.sizes.map((size) => convertSizeStringToSizeOption(size)),
      } as ICardsResponse),
  );
};
