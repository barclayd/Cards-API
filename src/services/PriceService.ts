import { ISizesResponse } from '@/models/ISizesResponse';
import { SizeOption } from '@/models/ISize';
import { QueryError } from '@/entity/QueryError';
import { ErrorMessage } from '@/models/ErrorMessage';

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

  private formatPrice(price: number): string {
    const priceFloat = price / 100;
    const priceAsFloat = priceFloat.toFixed(2).toString();
    return `£${priceAsFloat}`;
  }

  public calculatePrice(): string {
    const price = this.size ? this.priceForSize() : this.basePrice;
    return this.formatPrice(price);
  }
}
