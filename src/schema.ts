import { GraphQLSchema } from 'graphql';
import { buildSchema } from 'type-graphql';
import resolvers from './resolvers';

export const createSchema = async (): Promise<GraphQLSchema> => {
  return await buildSchema({
    resolvers,
    validate: true,
  });
};
