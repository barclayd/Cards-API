export interface INetworkClient {
  get: <T>(URL: string) => Promise<T>;
}
