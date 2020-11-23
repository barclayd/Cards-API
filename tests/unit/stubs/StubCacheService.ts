import { ICacheService } from '@/models/ICacheService';

export class StubCacheService implements ICacheService {
  async set() {
    return new Promise((resolve) => {
      resolve();
    }) as any;
  }

  async get(): Promise<any> {
    return new Promise((resolve) => {
      resolve();
    });
  }

  async clear() {
    return new Promise((resolve) => {
      resolve();
    }) as any;
  }
}
