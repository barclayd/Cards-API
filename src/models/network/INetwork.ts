import { Endpoint } from '@/models/network/Endpoints';

export interface INetwork {
  baseURL: string;
  get: <T>(endpoint: Endpoint) => Promise<T>;
  cacheTLL?: number;
}
