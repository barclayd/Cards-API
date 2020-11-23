import axios from 'axios';
import { INetwork } from '@/models/INetwork';
import { Endpoint } from '@/models/Endpoints';
import { QueryError } from '@/entity/QueryError';
import { ErrorMessage } from '@/models/ErrorMessage';
import { ICacheService } from '@/models/ICacheService';

export class NetworkService implements INetwork {
  constructor(public baseURL: string, private cacheService: ICacheService) {}

  public async get<T>(endpoint: Endpoint): Promise<T> {
    const URL = `${this.baseURL}/${endpoint}.json`;
    const cacheResultForURL = await this.cacheService.get<T>(URL);
    if (cacheResultForURL) {
      return cacheResultForURL;
    }
    const response = await axios.get(URL);
    if (response.data) {
      await this.cacheService.set(URL, response.data);
      return response.data;
    }
    throw new QueryError(`${ErrorMessage.generic} for endpoint: ${endpoint}`);
  }
}
