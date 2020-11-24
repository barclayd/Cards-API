import Redis from 'ioredis';
import { ICacheClient } from '@/models/ICacheClient';
import { ErrorMessage } from '@/models/ErrorMessage';
import { QueryError } from '@/entity/QueryError';

export class RedisService implements ICacheClient {
  private redis =
    process.env.NODE_ENV === 'ci'
      ? new Redis({ host: 'redis', port: 6379 })
      : new Redis();

  public async get<T>(key: string): Promise<T | undefined> {
    const value = await this.redis.get(key);
    if (value === null) {
      return;
    }
    try {
      return JSON.parse(value);
    } catch (error) {
      throw new QueryError(`${ErrorMessage.cacheReadError}: ${value}`);
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

  public async closeConnection() {
    await this.redis.quit();
  }
}
