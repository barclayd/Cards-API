export interface IQueryCacheService {
  cacheQuery<T>(query: () => Promise<T>): Promise<T>;
}
