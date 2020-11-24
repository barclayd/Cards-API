import { RedisService } from '@/services/cache/RedisService';
import { QueryError } from '@/entity/QueryError';
import { ErrorMessage } from '@/models/ErrorMessage';

describe('RedisService', () => {
  let service: RedisService;

  afterAll(async () => {
    // workaround for https://github.com/luin/ioredis/issues/1088
    await service.closeConnection();
  });

  describe('get', () => {
    beforeEach(() => {
      service = new RedisService();
    });

    afterEach(async () => {
      await service.closeConnection();
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('calls redis.get', async () => {
      jest.spyOn((service as any).redis, 'get').mockResolvedValue('{}');
      await service.get('someKey');
      expect((service as any).redis.get).toHaveBeenCalled();
    });
    it('calls redis.get with the correct parameter', async () => {
      const key = 'someKey';
      jest.spyOn((service as any).redis, 'get').mockResolvedValue('{}');
      await service.get(key);
      expect((service as any).redis.get).toHaveBeenCalledWith(key);
    });
    it('returns undefined if redis.get returns null', async () => {
      jest.spyOn((service as any).redis, 'get').mockResolvedValue(null);
      const value = await service.get('someKey');
      expect(value).toBeUndefined();
    });
    it('calls JSON.parse when redis.get value is not null', async () => {
      jest.spyOn((service as any).redis, 'get').mockResolvedValue('{}');
      jest.spyOn(JSON, 'parse').mockReturnValue({});
      await service.get('someKey');
      expect(JSON.parse).toHaveBeenCalled();
    });
    it('calls JSON.parse with the correct parameter when redis.get value is not null', async () => {
      const mockValueFromRedis = '{}';
      jest
        .spyOn((service as any).redis, 'get')
        .mockResolvedValue(mockValueFromRedis);
      jest.spyOn(JSON, 'parse').mockReturnValue({});
      await service.get('someKey');
      expect(JSON.parse).toHaveBeenCalledWith(mockValueFromRedis);
    });
    it('returns the JSON.parse value of redis.get value when value is not null', async () => {
      const wrappedValue = {
        test: 'test',
      };
      const redisGetValue = JSON.stringify(wrappedValue);
      jest
        .spyOn((service as any).redis, 'get')
        .mockResolvedValue(redisGetValue);
      jest.spyOn(JSON, 'parse').mockReturnValue(wrappedValue);
      const response = await service.get(redisGetValue);
      expect(response).toEqual(wrappedValue);
    });
    it('throws an error when the redis.get value cannot be parsed by JSON.parse', async () => {
      jest.spyOn((service as any).redis, 'get').mockResolvedValue('{}');
      jest.spyOn(JSON, 'parse').mockImplementation(() => {
        throw new Error();
      });
      async function get() {
        try {
          return Promise.reject(await service.get('someKey'));
        } catch (error) {
          throw new Error(error);
        }
      }
      await expect(get()).rejects.toThrow();
    });
    it('throws the correct error when the redis.get value cannot be parsed by JSON.parse', async () => {
      const mockRedisValue = '{}';
      jest
        .spyOn((service as any).redis, 'get')
        .mockResolvedValue(mockRedisValue);
      jest.spyOn(JSON, 'parse').mockImplementation(() => {
        throw new Error();
      });
      async function get() {
        try {
          return Promise.reject(await service.get('someKey'));
        } catch (error) {
          throw error;
        }
      }
      const expectedError = new QueryError(
        `${ErrorMessage.cacheReadError}: ${mockRedisValue}`,
      );
      await expect(get()).rejects.toThrowError(expectedError);
    });
  });
});
