import { PriceService } from '@/services/PriceService';
import { ISizesResponse } from '@/models/ISizesResponse';
import { SizeOption } from '@/models/ISize';
import { sizesResponse } from '../helpers/sizesResponse';
import { ErrorMessage, QueryError } from '@/helpers/error';

describe('PriceService', () => {
  let service: PriceService;

  const buildService = (
    basePrice: number,
    sizesResponse: ISizesResponse[],
    size?: SizeOption,
  ) => {
    service = new PriceService(basePrice, sizesResponse, size);
  };

  beforeEach(() => {
    buildService(1, sizesResponse, undefined);
  });

  describe('when size is defined', () => {
    it('calls priceForSize when calculatePrice is called', () => {
      buildService(1, sizesResponse, SizeOption.sm);
      const mockPriceForSize = jest.fn();
      jest
        .spyOn(service as any, 'priceForSize')
        .mockImplementation(mockPriceForSize);
      service.calculatePrice();
      expect(mockPriceForSize).toHaveBeenCalled();
    });
  });

  it('returns the correct price for the size provided when calculatePrice is called and sizesResponse includes the specified size', () => {
    const size = SizeOption.sm;
    const basePrice = 100;
    const priceMultiplier = 1.15;
    const sizesResponse: ISizesResponse[] = [
      {
        id: size,
        title: 'Some title',
        priceMultiplier,
      },
    ];
    buildService(100, sizesResponse, size);
    const price = service.calculatePrice();
    const expectedPrice = priceMultiplier * basePrice;
    expect(price).toEqual(expectedPrice);
  });

  it('throws an error when calculatePrize is called and the size specified does not exist in sizesReponse', () => {
    const size = SizeOption.gt;
    const sizesResponse: ISizesResponse[] = [
      {
        id: SizeOption.sm,
        title: 'Some title',
        priceMultiplier: 1.4,
      },
    ];
    expect(
      sizesResponse.find((sizeResponse) => sizeResponse.id === size),
    ).not.toBeDefined();
    buildService(100, sizesResponse, size);
    expect(() => {
      service.calculatePrice();
    }).toThrow();
  });

  it('throws a QueryError with the correct message when calculatePrize is called and the size specified does not exist in sizesReponse', () => {
    const size = SizeOption.gt;
    const sizesResponse: ISizesResponse[] = [
      {
        id: SizeOption.sm,
        title: 'Some title',
        priceMultiplier: 1.4,
      },
    ];
    expect(
      sizesResponse.find((sizeResponse) => sizeResponse.id === size),
    ).not.toBeDefined();
    buildService(100, sizesResponse, size);
    const expectedError = new QueryError(
      ErrorMessage.missingPriceInformationForSize,
    );
    expect(() => {
      service.calculatePrice();
    }).toThrowError(expectedError);
  });

  describe('when size is undefined', () => {
    it('return the price as base price when calculatePrice is called', () => {
      const basePrice = 1;
      buildService(basePrice, sizesResponse, undefined);
      const price = service.calculatePrice();
      expect(price).toEqual(basePrice);
    });
  });
});
