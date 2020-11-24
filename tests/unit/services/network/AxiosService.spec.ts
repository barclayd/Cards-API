import { AxiosService } from '../../../../src/services/network/AxiosService';
import axios from 'axios';
import { ITemplatesResponse } from '@/models/ITemplatesResponse';
import { Endpoint } from '@/models/Endpoints';
import templatesResponse from '@t/unit/data/templates.json';
import { QueryError } from '@/entity/QueryError';
import { ErrorMessage } from '@/models/ErrorMessage';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('AxiosService', () => {
  let service: AxiosService;

  describe('GET request', () => {
    beforeEach(() => {
      service = new AxiosService();
      mockedAxios.get.mockResolvedValue({
        data: {},
      });
    });

    it('calls axios.get', async () => {
      await service.get<ITemplatesResponse>(Endpoint.sizes);
      expect(mockedAxios.get).toHaveBeenCalled();
    });

    it('returns the data node of the response if it exists', async () => {
      const expectedData = templatesResponse;
      mockedAxios.get.mockResolvedValue({
        data: expectedData,
      });
      const data = await service.get<ITemplatesResponse>(Endpoint.sizes);
      expect(data).toEqual(expectedData);
    });

    it('calls axios.get method with the correct URL', async () => {
      const URL = 'https://test.com';
      mockedAxios.get.mockResolvedValue({
        data: {},
      });
      await service.get<ITemplatesResponse>(URL);
      expect(mockedAxios.get).toHaveBeenCalledWith(URL);
    });

    it('throws an error when the data node on response is undefined', async () => {
      const endpoint = Endpoint.sizes;
      mockedAxios.get.mockResolvedValue({});
      async function get() {
        try {
          return Promise.reject(
            await service.get<ITemplatesResponse>(endpoint),
          );
        } catch (error) {
          throw new Error(error);
        }
      }
      await expect(get()).rejects.toThrow();
    });

    it('throws the correct error when the data node on response is undefined', async () => {
      const URL = 'https://test.com';
      mockedAxios.get.mockResolvedValue({});
      async function get() {
        try {
          return Promise.reject(await service.get<ITemplatesResponse>(URL));
        } catch (error) {
          throw error;
        }
      }
      const expectedError = new QueryError(
        `${ErrorMessage.network} for URL: ${URL}`,
      );
      await expect(get()).rejects.toThrowError(expectedError);
    });
  });
});
