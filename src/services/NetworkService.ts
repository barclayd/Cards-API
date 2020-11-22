import axios from 'axios';
import { INetwork } from '@/models/INetwork';
import { Endpoint } from '@/models/Endpoints';
import { QueryError } from '@/entity/QueryError';
import { ErrorMessage } from '@/models/ErrorMessage';

export class NetworkService implements INetwork {
  constructor(public baseURL: string) {}

  public async get<T>(endpoint: Endpoint): Promise<T> {
    const URL = `${this.baseURL}/${endpoint}.json`;
    const response = await axios.get(URL);
    if (response.data) {
      return response.data;
    }
    throw new QueryError(`${ErrorMessage.generic} for endpoint: ${endpoint}`);
  }
}
