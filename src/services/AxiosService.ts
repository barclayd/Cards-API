import { INetworkClient } from '@/models/INetworkClient';
import axios from 'axios';
import { QueryError } from '@/entity/QueryError';
import { ErrorMessage } from '@/models/ErrorMessage';

export class AxiosService implements INetworkClient {
  public async get<T>(URL: string) {
    const response = await axios.get<T>(URL);
    if (!response.data) {
      throw new QueryError(ErrorMessage.network);
    }
    return response.data;
  }
}
