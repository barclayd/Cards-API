import { INetworkClient } from '@/models/INetworkClient';

export class StubNetworkClient implements INetworkClient {
  public async get() {
    return jest.fn().mockResolvedValue({}) as any;
  }
}
