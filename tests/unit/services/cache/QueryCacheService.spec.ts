import { QueryCacheService } from '@/services/cache/QueryCacheService';
import { StubCacheService } from '@t/unit/stubs/StubCacheService';

describe('QueryCacheService', () => {
  let service: QueryCacheService;
  const stubCacheService = new StubCacheService();

  const buildService = (
    queryName: string,
    queryArgs?: any,
    cacheTimeToLive?: number,
  ) => {
    service = new QueryCacheService(
      stubCacheService,
      queryName,
      queryArgs,
      cacheTimeToLive,
    );
  };

  beforeEach(() => {
    buildService('someQuery', { hello: 'world' }, 100);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('cacheQuery', () => {
    it('calls cacheService.get with the correct cache key when queryArgs are provided', async () => {
      jest.spyOn(stubCacheService, 'get');
      const queryName = 'someQuery';
      const queryArgs = {
        hello: 'world',
      };
      buildService(queryName, queryArgs);
      await service.cacheQuery(jest.fn());
      const expectedKey = `${queryName}-${JSON.stringify(queryArgs)}`;
      expect(stubCacheService.get).toHaveBeenCalledWith(expectedKey);
    });

    it('has the expected cacheKey when queryArgs are undefined', async () => {
      jest.spyOn(stubCacheService, 'get');
      const queryName = 'someQuery';
      buildService(queryName);
      await service.cacheQuery(jest.fn());
      expect(stubCacheService.get).toHaveBeenCalledWith(queryName);
    });

    it('returns the cachedQuery when cachedQuery is defined', async () => {
      const cachedQuery = {};
      jest.spyOn(stubCacheService, 'get').mockResolvedValue(cachedQuery);
      const result = await service.cacheQuery(jest.fn());
      expect(result).toEqual(cachedQuery);
    });

    it('calls cacheService.set when cachedQuery is undefined', async () => {
      jest.spyOn(stubCacheService, 'set');
      await service.cacheQuery(jest.fn());
      expect(stubCacheService.set).toHaveBeenCalled();
    });

    it('calls cacheService.set with the correct parameters when cachedQuery is undefined', async () => {
      jest.spyOn(stubCacheService, 'set');
      const queryName = 'someQuery';
      const queryArgs = {
        hello: 'world',
      };
      const cacheTimeToLive = 100;
      buildService(queryName, queryArgs, cacheTimeToLive);
      const queryResponse = {};
      await service.cacheQuery(jest.fn().mockReturnValue(queryResponse));
      const expectedKey = `${queryName}-${JSON.stringify(queryArgs)}`;
      expect(stubCacheService.set).toHaveBeenCalledWith(
        expectedKey,
        queryResponse,
        cacheTimeToLive,
      );
    });

    it('returns the queryResponse when cachedQuery is undefined', async () => {
      const cachedQuery = undefined;
      jest.spyOn(stubCacheService, 'get').mockResolvedValue(cachedQuery);
      const queryResponse = {};
      const result = await service.cacheQuery(
        jest.fn().mockReturnValue(queryResponse),
      );
      expect(result).toEqual(queryResponse);
    });
  });
});
