import { SizeOption } from '@/models/ISize';
import { ICardsRawResponse } from '../models/ICardsRawResponse';
import { ICardsResponse } from '@/models/ICardsResponse';
import { ISizesRawResponse } from '../models/ISizesRawResponse';
import { ISizesResponse } from '@/models/ISizesResponse';

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
