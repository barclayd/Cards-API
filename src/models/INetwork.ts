import { Endpoint } from '@/models/Endpoints';

export interface INetwork {
  baseURL: string;
  get: <T>(endpoint: Endpoint) => Promise<T>;
}
