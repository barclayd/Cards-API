import { SizeOption } from '@/models/ISize';
import { ICardsRawResponse } from '../models/ICardsRawResponse';
import { ICardResponse } from '@/models/ICardResponse';
import { ISizesRawResponse } from '../models/ISizesRawResponse';
import { ISizesResponse } from '@/models/ISizesResponse';

export const convertSizeStringToSizeOption = (
  sizeString: string,
): SizeOption => {
  return (SizeOption as any)[sizeString];
};

export const rawCardResponseToCardResponse = (
  rawCardsResponse: ICardsRawResponse[],
): ICardResponse[] => {
  return rawCardsResponse.map(
    (rawCard) =>
      ({
        ...rawCard,
        sizes: rawCard.sizes.map((size) => convertSizeStringToSizeOption(size)),
      } as ICardResponse),
  );
};

export const rawSizeResponseToSizeResponse = (
  rawSizesResponse: ISizesRawResponse[],
): ISizesResponse[] => {
  return rawSizesResponse.map(
    (rawSize) =>
      ({
        ...rawSize,
        id: convertSizeStringToSizeOption(rawSize.id),
      } as ISizesResponse),
  );
};
