import { INetwork } from '@/models/network/INetwork';
import { Endpoint } from '@/models/network/Endpoints';
import { ICacheService } from '@/models/cache/ICacheService';
import { INetworkClient } from '@/models/network/INetworkClient';
import { AxiosService } from '@/services/network/AxiosService';

export class NetworkService implements INetwork {
  constructor(
    public baseURL: string,
    private cacheService: ICacheService,
    public cacheTTL?: number,
    private networkClient: INetworkClient = new AxiosService(),
  ) {}

  public async get<T>(endpoint: Endpoint): Promise<T> {
    const URL = `${this.baseURL}/${endpoint}.json`;
    const cacheResultForURL = await this.cacheService.get<T>(URL);
    if (cacheResultForURL) {
      return cacheResultForURL;
    }
    const response = await this.networkClient.get<T>(URL);
    await this.cacheService.set(URL, response, this.cacheTTL);
    return response;
  }
}
