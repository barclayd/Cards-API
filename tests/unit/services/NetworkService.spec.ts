import { NetworkService } from '@/services/NetworkService';
import axios from 'axios';
import templatesResponse from '../data/templates.json';
import { ITemplatesResponse } from '@/models/ITemplatesResponse';
import { Endpoint } from '@/models/Endpoints';
import { QueryError } from '@/entity/QueryError';
import { ErrorMessage } from '@/models/ErrorMessage';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('NetworkService', () => {
  let service: NetworkService;

  const buildService = (baseURL = 'https://test.endpoint.com') => {
    service = new NetworkService(baseURL);
  };

  beforeEach(() => {
    buildService();
  });

  describe('get', () => {
    beforeEach(() => {
      mockedAxios.get.mockResolvedValue({
        data: {},
      });
    });

    it('returns the data node of the response if it exists', async () => {
      const expectedData = templatesResponse;
      mockedAxios.get.mockResolvedValue({
        data: expectedData,
      });
      const data = await service.get<ITemplatesResponse>(Endpoint.sizes);
      expect(data).toEqual(expectedData);
    });

    it('calls axios.get method', async () => {
      await service.get<ITemplatesResponse>(Endpoint.sizes);
      expect(mockedAxios.get).toHaveBeenCalled();
    });

    it('calls axios.get method with the correct URL', async () => {
      const endpoint = Endpoint.sizes;
      mockedAxios.get.mockResolvedValue({
        data: {},
      });
      await service.get<ITemplatesResponse>(endpoint);
      const expectedURL = `${service.baseURL}/${endpoint}.json`;
      expect(mockedAxios.get).toHaveBeenCalledWith(expectedURL);
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
      const endpoint = Endpoint.sizes;
      mockedAxios.get.mockResolvedValue({});
      async function get() {
        try {
          return Promise.reject(
            await service.get<ITemplatesResponse>(endpoint),
          );
        } catch (error) {
          throw error;
        }
      }
      const expectedError = new QueryError(
        `${ErrorMessage.generic} for endpoint: ${endpoint}`,
      );
      await expect(get()).rejects.toThrowError(expectedError);
    });
  });
});
