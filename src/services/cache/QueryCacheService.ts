import { ICacheService } from '@/models/cache/ICacheService';
import { IQueryCacheService } from '@/models/cache/IQueryCacheService';

export class QueryCacheService implements IQueryCacheService {
  constructor(
    private cacheService: ICacheService,
    private queryName: string,
    private queryArgs?: any,
    private cacheTimeToLive?: number,
  ) {}

  private get cacheKeyForQuery(): string {
    return this.queryArgs
      ? `${this.queryName}-${JSON.stringify(this.queryArgs)}`
      : this.queryName;
  }

  private async cacheResultForQuery<T>() {
    return await this.cacheService.get<T>(this.cacheKeyForQuery);
  }

  private async setCacheForQuery(queryResponse: any, cacheTTL?: number) {
    return await this.cacheService.set(
      this.cacheKeyForQuery,
      queryResponse,
      cacheTTL,
    );
  }

  public async cacheQuery<T>(query: () => Promise<T>): Promise<T> {
    const cachedQuery = await this.cacheResultForQuery<T>();
    if (cachedQuery) {
      console.log('serve from cache');
      return cachedQuery;
    }
    const queryResponse = await query();
    await this.setCacheForQuery(queryResponse, this.cacheTimeToLive);
    return queryResponse;
  }
}
