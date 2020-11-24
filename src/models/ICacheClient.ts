export interface ICacheClient {
  get<T>(key: string): Promise<T | undefined>;
  set(key: string, value: any, expiresIn?: number): Promise<void>;
  clear(): Promise<void>;
  closeConnection(): Promise<void>;
}
