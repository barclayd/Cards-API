import { ApolloError } from 'apollo-server-express';

export class QueryError extends ApolloError {
  constructor(message: string) {
    super(message, 'QUERY FAILURE');

    Object.defineProperty(this, 'name', { value: 'QueryError' });
  }
}

export enum ErrorMessage {
  generic = 'Failed to retrieve query',
  detailedCardGeneration= 'Unable to generate detailed card for the options provided'
}
