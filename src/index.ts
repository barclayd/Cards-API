import 'dotenv/config';
import 'reflect-metadata';
import moduleAlias from 'module-alias';
if (process.env.NODE_ENV === 'production') {
  moduleAlias();
}
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { createSchema } from './schema';
import { QueryComplexityPlugin } from '@/plugins/QueryComplexity';

(async () => {
  const app = express();

  const schema = await createSchema();
  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }) => ({ req, res }),
    plugins: [QueryComplexityPlugin(schema)],
  });

  apolloServer.applyMiddleware({ app, cors: false });
  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`server started at http://localhost:${port}/graphql 🚀`);
  });
})();
