import { INetworkClient } from '@/models/network/INetworkClient';

export class StubNetworkClient implements INetworkClient {
  public async get() {
    return jest.fn().mockResolvedValue({}) as any;
  }
}
