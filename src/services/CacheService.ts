import Redis from 'ioredis';

import { ICacheService } from '@/models/ICacheService';

export class CacheService implements ICacheService {
  constructor(private redis = new Redis()) {}

  public static shared = new CacheService();

  public async get<T>(key: string): Promise<T | undefined> {
    const value = await this.redis.get(key);
    if (value === null) {
      return;
    }
    try {
      return JSON.parse(value);
    } catch (error) {
      throw new Error(`CacheService error occurred parsing value: ${value}`);
    }
  }

  public async set(key: string, value: any, expiresIn?: number) {
    const valueAsString = JSON.stringify(value);
    if (expiresIn) {
      await this.redis.set(key, valueAsString, 'EX', expiresIn);
    } else {
      await this.redis.set(key, valueAsString);
    }
  }

  public async clear() {
    await this.redis.flushall();
  }
}
