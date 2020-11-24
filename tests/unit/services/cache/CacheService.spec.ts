import { CacheService, redisCacheService } from '@/services/cache/CacheService';
import { ICacheClient } from '@/models/ICacheClient';

describe('CacheService', () => {
  let service: CacheService;
  let stubCacheClient: ICacheClient;

  beforeEach(() => {
    stubCacheClient = {
      async get() {
        return jest.fn().mockResolvedValue({}) as any;
      },
      async set() {},
      async clear() {},
      async closeConnection() {},
    };
    service = new CacheService(stubCacheClient);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  afterAll(async () => {
    // workaround for https://github.com/luin/ioredis/issues/1088
    await redisCacheService.closeConnection();
  });

  it('calls cacheClient.get when get is called', async () => {
    jest.spyOn(stubCacheClient, 'get').mockResolvedValue({});
    await service.get('someKey');
    expect(stubCacheClient.get).toHaveBeenCalled();
  });
  it('calls cacheClient.get with the correct parameter when get is called', async () => {
    const key = 'randomKey';
    jest.spyOn(stubCacheClient, 'get').mockResolvedValue({});
    await service.get(key);
    expect(stubCacheClient.get).toHaveBeenCalledWith(key);
  });
  it('calls cacheClient.set when set is called', async () => {
    jest.spyOn(stubCacheClient, 'set');
    await service.set('someKey', 'someValue');
    expect(stubCacheClient.set).toHaveBeenCalled();
  });
  it('calls cacheClient.set with the correct parameters when set is called', async () => {
    const key = 'someKey';
    const value = 'someValue';
    const expiresIn = 100;
    jest.spyOn(stubCacheClient, 'set');
    await service.set(key, value, expiresIn);
    expect(stubCacheClient.set).toHaveBeenCalledWith(key, value, expiresIn);
  });
  it('calls cacheClient.clear when clear is called', async () => {
    jest.spyOn(stubCacheClient, 'clear');
    await service.clear();
    expect(stubCacheClient.clear).toHaveBeenCalled();
  });
  it('calls cacheClient.closeConnection when closeConnection is called', async () => {
    jest.spyOn(stubCacheClient, 'closeConnection');
    await service.closeConnection();
    expect(stubCacheClient.closeConnection).toHaveBeenCalled();
  });
});
