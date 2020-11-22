import { ISizesResponse } from '@/models/ISizesResponse';
import { SizeOption } from '@/models/ISize';
import { ErrorMessage, QueryError } from '@/helpers/error';

export class PriceService {
  constructor(
    private basePrice: number,
    private sizesResponse: ISizesResponse[],
    private size?: SizeOption,
  ) {}

  private priceMultiplierForSize(): number {
    const error = new QueryError(ErrorMessage.missingPriceInformationForSize);
    if (!this.size) {
      throw error;
    }
    const size = this.sizesResponse.find(
      (sizeResponse) => sizeResponse.id === this.size,
    );
    if (!size) {
      throw error;
    }
    return size.priceMultiplier;
  }

  private priceForSize(): number {
    return this.priceMultiplierForSize() * this.basePrice;
  }

  public calculate(): number {
    if (!this.size) {
      return this.basePrice;
    }
    return this.priceForSize();
  }
}
