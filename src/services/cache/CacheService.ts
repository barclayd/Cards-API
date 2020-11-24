import { ICacheService } from '@/models/cache/ICacheService';
import { ICacheClient } from '@/models/cache/ICacheClient';
import { RedisService } from '@/services/cache/RedisService';

export class CacheService implements ICacheService {
  constructor(private cacheClient: ICacheClient) {}

  public async get<T>(key: string): Promise<T | undefined> {
    return await this.cacheClient.get(key);
  }

  public async set(key: string, value: any, expiresIn?: number) {
    await this.cacheClient.set(key, value, expiresIn);
  }

  public async clear() {
    await this.cacheClient.clear();
  }

  public async closeConnection() {
    await this.cacheClient.closeConnection();
  }
}

export const redisCacheService = new CacheService(new RedisService());
