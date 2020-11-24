import { redisCacheService } from '@/services/cache/CacheService';

describe('CacheService', () => {
  afterAll(async () => {
    // workaround for https://github.com/luin/ioredis/issues/1088
    await redisCacheService.closeConnection();
  });

  describe('redisCacheService', () => {
    it('is of type CacheService', () => {
      expect(redisCacheService.constructor.name).toEqual('CacheService');
    });
  });
});
