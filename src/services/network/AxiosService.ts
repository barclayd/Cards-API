import { INetworkClient } from '@/models/network/INetworkClient';
import axios from 'axios';
import { QueryError } from '@/entity/QueryError';
import { ErrorMessage } from '@/models/ErrorMessage';

export class AxiosService implements INetworkClient {
  public async get<T>(URL: string) {
    const response = await axios.get<T>(URL);
    if (!response.data) {
      throw new QueryError(`${ErrorMessage.network} for URL: ${URL}`);
    }
    return response.data;
  }
}
