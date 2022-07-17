import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import express from 'express';
import http from 'http';
import { connectDB } from '@standup/common';

import { buildCompleteSchema } from './buildSchema';
import { getAuthMiddleware } from './middlewares/auth';
import { CustomRequest } from './types/CustomRequest';
import { getDataLoaders } from './modules/loaders';

async function startApolloServer() {
  const app = express();
  app.use(getAuthMiddleware());

  const httpServer = http.createServer(app);

  const schema = buildCompleteSchema();

  const server = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    context: ({ req }) => {
      return {
        user: (req as CustomRequest).auth.user,
        auth: { error: (req as CustomRequest).auth.error },
        dataloaders: getDataLoaders(),
      };
    },
  });

  connectDB();

  await server.start();
  server.applyMiddleware({ app });

  // eslint-disable-next-line no-promise-executor-return
  await new Promise<void>((resolve) => httpServer.listen({ port: 5000 }, resolve));
  // eslint-disable-next-line no-console
  console.log(`🚀 Server ready at http://localhost:5000${server.graphqlPath}`);
}

startApolloServer();
