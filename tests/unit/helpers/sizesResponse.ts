import rawSizesResponse from '@t/unit/data/sizes.json';
import { rawSizeResponseToSizeResponse } from './util';

export const sizesResponse = rawSizeResponseToSizeResponse(rawSizesResponse);
