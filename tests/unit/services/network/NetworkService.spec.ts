import { NetworkService } from '@/services/network/NetworkService';
import { ICacheService } from '@/models/ICacheService';
import { StubCacheService } from '@t/unit/stubs/StubCacheService';
import { INetworkClient } from '@/models/INetworkClient';
import { StubNetworkClient } from '@t/unit/stubs/StubNetworkClient';
import { Endpoint } from '@/models/Endpoints';
import { cardsResponse } from '../../helpers/cardsResponse';

describe('NetworkService', () => {
  let service: NetworkService;
  const stubCacheService: ICacheService = new StubCacheService();
  const stubNetworkClient: INetworkClient = new StubNetworkClient();

  const buildService = (baseURL = 'https://test.endpoint.com') => {
    service = new NetworkService(
      baseURL,
      stubCacheService,
      undefined,
      stubNetworkClient,
    );
  };

  beforeEach(() => {
    buildService();
  });

  describe('get', () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    describe('cache hit', () => {
      it('calls cacheService get method', async () => {
        const URL = 'https://url.com';
        const endpoint = Endpoint.templates;
        jest.spyOn(stubCacheService, 'get').mockResolvedValue(jest.fn);
        buildService(URL);
        await service.get(endpoint);
        expect(stubCacheService.get).toHaveBeenCalled();
      });

      it('calls cacheService get method with the correct parameter', async () => {
        const URL = 'https://url.com';
        const endpoint = Endpoint.templates;
        jest.spyOn(stubCacheService, 'get').mockResolvedValue(jest.fn);
        buildService(URL);
        await service.get(endpoint);
        const expectedURL = `${URL}/${endpoint}.json`;
        expect(stubCacheService.get).toHaveBeenCalledWith(expectedURL);
      });

      it('returns the response from the cacheService get method when the response is not undefined', async () => {
        const URL = 'https://url.com';
        const endpoint = Endpoint.templates;
        const responseFromCache = cardsResponse;
        jest
          .spyOn(stubCacheService, 'get')
          .mockResolvedValue(responseFromCache);
        buildService(URL);
        const response = await service.get(endpoint);
        expect(response).toBeDefined();
        expect(response).toEqual(responseFromCache);
      });
    });

    describe('cache miss', () => {
      it('calls networkClient get method when cacheResultForURL is undefined', async () => {
        const URL = 'https://url.com';
        const endpoint = Endpoint.templates;
        jest.spyOn(stubNetworkClient, 'get').mockResolvedValue(jest.fn());
        buildService();
        const cacheResultForURL = await stubCacheService.get(URL);
        expect(cacheResultForURL).toBeUndefined();
        await service.get(endpoint);
        expect(stubNetworkClient.get).toHaveBeenCalled();
      });

      it('calls networkClient get method with the correct parameter when cacheResultForURL is undefined', async () => {
        const URL = 'https://url.com';
        const endpoint = Endpoint.templates;
        jest.spyOn(stubNetworkClient, 'get').mockResolvedValue(jest.fn());
        buildService(URL);
        const cacheResultForURL = await stubCacheService.get(URL);
        expect(cacheResultForURL).toBeUndefined();
        await service.get(endpoint);
        const expectedURL = `${URL}/${endpoint}.json`;
        expect(stubNetworkClient.get).toHaveBeenCalledWith(expectedURL);
      });

      it('calls cacheService.set when the cacheResultForURL is undefined', async () => {
        const URL = 'https://url.com';
        const endpoint = Endpoint.templates;
        jest.spyOn(stubCacheService, 'set');
        buildService(URL);
        const cacheResultForURL = await stubCacheService.get(URL);
        expect(cacheResultForURL).toBeUndefined();
        await service.get(endpoint);
        expect(stubCacheService.set).toHaveBeenCalled();
      });

      it('calls cacheService.set with the correct parameters when the cacheResultForURL is undefined', async () => {
        const url = 'https://url.com';
        const endpoint = Endpoint.templates;
        const mockValueForNetworkClientGet = cardsResponse;
        jest
          .spyOn(stubNetworkClient, 'get')
          .mockResolvedValue(mockValueForNetworkClientGet);
        jest.spyOn(stubCacheService, 'set');
        const cacheTTL = 100;
        service = new NetworkService(
          url,
          stubCacheService,
          cacheTTL,
          stubNetworkClient,
        );
        const cacheResultForURL = await stubCacheService.get(url);
        expect(cacheResultForURL).toBeUndefined();
        await service.get(endpoint);
        const expectedURL = `${url}/${endpoint}.json`;
        expect(stubCacheService.set).toHaveBeenCalledWith(
          expectedURL,
          mockValueForNetworkClientGet,
          cacheTTL,
        );
      });

      it('returns the response from the networkClient when cacheResultForURL is undefined', async () => {
        const URL = 'https://url.com';
        const endpoint = Endpoint.templates;
        const networkClientResponse = cardsResponse;
        jest
          .spyOn(stubNetworkClient, 'get')
          .mockResolvedValue(networkClientResponse);
        const cacheResultForURL = await stubCacheService.get(URL);
        expect(cacheResultForURL).toBeUndefined();
        const response = await service.get(endpoint);
        expect(response).toEqual(networkClientResponse);
      });
    });
  });
});
