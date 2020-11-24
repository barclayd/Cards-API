import { ApolloServer } from 'apollo-server-express';
import { QueryComplexityPlugin } from '@/plugins/QueryComplexity';
import { createSchema } from '@/schema';
import express from 'express';
import { ICacheService } from '@/models/ICacheService';
import { redisCacheService } from '@/services/CacheService';

export class ServerService {
  constructor(
    public port?: string,
    private cacheService: ICacheService = redisCacheService,
  ) {}

  private server: ApolloServer;
  private app = express();

  private async setupApollo() {
    const schema = await createSchema();
    this.server = new ApolloServer({
      schema,
      context: ({ req, res }) => ({ req, res }),
      plugins: [QueryComplexityPlugin(schema)],
    });
  }

  private applyMiddleware() {
    this.server.applyMiddleware({
      app: this.app,
      cors: false,
    });
  }

  private listen() {
    const port = this.port ?? 4000;
    this.app.listen(port, () => {
      console.log(`server started at http://localhost:${port}/graphql 🚀`);
    });
  }

  private async resetCache() {
    await this.cacheService.clear();
  }

  public async start() {
    await this.resetCache();
    await this.setupApollo();
    this.applyMiddleware();
    this.listen();
  }
}
