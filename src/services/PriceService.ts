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
    const calculationError = new QueryError(
      ErrorMessage.missingPriceInformationForSize,
    );
    if (!this.size) {
      throw calculationError;
    }
    const size = this.sizesResponse.find(
      (sizeResponse) => sizeResponse.id === this.size,
    );
    if (!size) {
      throw calculationError;
    }
    return size.priceMultiplier;
  }

  private priceForSize(): number {
    return this.priceMultiplierForSize() * this.basePrice;
  }

  public calculatePrice(): number {
    if (!this.size) {
      return this.basePrice;
    }
    return this.priceForSize();
  }
}
