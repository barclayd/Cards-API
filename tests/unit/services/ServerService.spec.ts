import { ServerService } from '@/services/ServerService';
import { StubCacheService } from '../stubs/StubCacheService';
import { ICacheService } from '@/models/cache/ICacheService';
import { redisCacheService } from '@/services/cache/CacheService';

jest.mock('apollo-server-express');

describe('ServerService', () => {
  describe('start', () => {
    let service: ServerService;
    let cacheServiceStub: StubCacheService;

    const buildService = (cacheService: ICacheService, port?: number) => {
      service = new ServerService(port, cacheService);
    };

    beforeEach(async () => {
      cacheServiceStub = new StubCacheService();
      buildService(cacheServiceStub);
      jest.spyOn((service as any).app, 'listen').mockImplementation(jest.fn());
    });

    afterAll(async () => {
      await redisCacheService.closeConnection();
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('calls applyMiddleware', async () => {
      jest
        .spyOn(service as any, 'applyMiddleware')
        .mockImplementation(jest.fn());
      await service.start();
      expect((service as any).applyMiddleware).toHaveBeenCalled();
    });
    it('calls app.listen', async () => {
      await service.start();
      expect((service as any).app.listen).toHaveBeenCalled();
    });
    it('calls app.setupApollo', async () => {
      jest.spyOn(service as any, 'setupApollo');
      jest.spyOn(service as any, 'applyMiddleware');
      await service.start();
      expect((service as any).setupApollo).toHaveBeenCalled();
    });
    it('calls app.listen with the correct port number when a port number is defined', async () => {
      const listenSpy = jest.fn();
      const port = 8000;
      buildService(cacheServiceStub, port);
      jest.spyOn((service as any).app, 'listen').mockImplementation(listenSpy);
      await service.start();
      expect(listenSpy).toBeCalledWith(port, expect.any(Function));
    });
    it('calls app.listen with the correct port number when a port number is not defined', async () => {
      const listenSpy = jest.fn();
      buildService(cacheServiceStub, undefined);
      jest.spyOn((service as any).app, 'listen').mockImplementation(listenSpy);
      await service.start();
      const expectedPortNumber = 4000;
      expect(listenSpy).toBeCalledWith(
        expectedPortNumber,
        expect.any(Function),
      );
    });
    it('calls resetCache', async () => {
      jest.spyOn(service as any, 'resetCache');
      await service.start();
      expect((service as any).resetCache).toHaveBeenCalled();
    });
    it('calls cacheService.reset cache', async () => {
      jest.spyOn(cacheServiceStub, 'clear');
      await service.start();
      expect(cacheServiceStub.clear).toHaveBeenCalled();
    });
  });
});
