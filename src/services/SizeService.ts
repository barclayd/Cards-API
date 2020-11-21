import { ISizesResponse } from '@/models/ISizesResponse';
import { SizeOption } from '@/models/ISize';
import { Size } from '@/entity/Size';

export class SizeService {

  constructor(
    private cardSizes: SizeOption[],
    private sizesResponse: ISizesResponse[],
  ) {}

  private sizeForSizeOption(cardSize: SizeOption): Size | undefined  {
    const size = this.sizesResponse.find(sizeResponse => sizeResponse.id === cardSize);
    if (!size) {
      return undefined;
    }
    return new Size(size.id, size.title);
  }

  public availableSizes(): Size[] {
    return this.cardSizes.reduce((acc, cardSize) => {
      const size = this.sizeForSizeOption(cardSize);
      if (size) {
        acc.push(size);
      }
      return acc;
    }, [] as Size[]);
  }

}
