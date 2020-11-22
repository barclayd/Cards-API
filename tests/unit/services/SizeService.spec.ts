import { SizeService } from '@/services/SizeService';
import { SizeOption } from '@/models/ISize';
import { ISizesResponse } from '@/models/ISizesResponse';
import { sizesResponse } from '../helpers/sizesResponse';

describe('SizeService', () => {
  let service: SizeService;

  const buildService = (
    cardSizes: SizeOption[],
    sizesResponse: ISizesResponse[],
  ) => {
    service = new SizeService(cardSizes, sizesResponse);
  };

  beforeEach(() => {
    buildService([SizeOption.sm, SizeOption.md, SizeOption.lg], sizesResponse);
  });

  it('returns an expected array of availableSizes when availableSizes is called and cardSizes array is not empty', () => {
    const availableSizes = service.availableSizes();
    const expectedAvailableSizes = [
      { id: 'sm', title: 'Small' },
      { id: 'md', title: 'Medium' },
      { id: 'lg', title: 'Large' },
    ];
    expect(availableSizes).toEqual(expectedAvailableSizes);
  });

  it('calls sizeForSizeOption the same number of times as there are cardSizes', () => {
    const cardSizes = [
      SizeOption.sm,
      SizeOption.md,
      SizeOption.lg,
      SizeOption.gt,
    ];
    buildService(cardSizes, sizesResponse);
    const mockSizeForSizeOption = jest.fn();
    jest
      .spyOn(service as any, 'sizeForSizeOption')
      .mockImplementation(mockSizeForSizeOption);
    service.availableSizes();
    const expectedNumberOfTimesToBeCalled = cardSizes.length;
    expect(mockSizeForSizeOption).toBeCalledTimes(
      expectedNumberOfTimesToBeCalled,
    );
  });

  it('returns an empty array of sizes when availableSizes is called when the cardsSizes array is empty', () => {
    buildService([], sizesResponse);
    const availableSizes = service.availableSizes();
    expect(availableSizes).toEqual([]);
  });

  it('only returns the number of cardSizes that match an id in the sizesResponse', () => {
    const cardSizes: SizeOption[] = [
      SizeOption.sm,
      SizeOption.md,
      SizeOption.lg,
      SizeOption.gt,
    ];
    const sizesResponse: ISizesResponse[] = [
      {
        id: SizeOption.sm,
        title: 'some title',
        priceMultiplier: 0.5,
      },
    ];
    const expectedNumberOfSizes = 1;
    buildService(cardSizes, sizesResponse);
    const availableSizes = service.availableSizes();
    expect(availableSizes).toHaveLength(expectedNumberOfSizes);
  });
});
