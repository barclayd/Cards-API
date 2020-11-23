import Redis from 'ioredis';

import { ICacheService } from '@/models/ICacheService';

export class CacheService implements ICacheService {
  constructor(private redis = new Redis()) {}

  public static shared = new CacheService();

  public async get<T>(key: string): Promise<T | undefined> {
    const value = await this.redis.get(key);
    if (value === null) {
      return undefined;
    }
    try {
      return JSON.parse(value);
    } catch (error) {
      console.log(`Error occurred parsing value: ${value}`);
      throw error;
    }
  }

  public async set(key: string, value: any) {
    await this.redis.set(key, JSON.stringify(value));
  }
}
