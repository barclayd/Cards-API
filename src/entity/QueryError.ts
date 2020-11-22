import { ApolloError } from 'apollo-server-express';

export class QueryError extends ApolloError {
  constructor(message: string) {
    super(message, 'QUERY FAILURE');

    Object.defineProperty(this, 'name', { value: 'QueryError' });
  }
}
