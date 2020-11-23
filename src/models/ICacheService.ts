export interface ICacheService {
  get<T>(key: string): Promise<T | undefined>;
  set: (key: string, value: any) => Promise<void>;
}
