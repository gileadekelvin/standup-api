import http from 'http';

import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { connectDB } from '@standup/common';
import * as Sentry from '@sentry/node';

import { buildCompleteSchema } from './buildSchema';
import { getAuthMiddleware } from './middlewares/auth';
import { CustomRequest } from './types/CustomRequest';
import { getDataLoaders } from './modules/loaders';

async function startApolloServer() {
  const app = express();
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    enabled: process.env.NODE_ENV === 'production',
  });

  app.use(getAuthMiddleware());

  const httpServer = http.createServer(app);

  const schema = buildCompleteSchema();

  const server = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    context: ({ req }) => {
      return {
        user: (req as CustomRequest).auth?.user,
        auth: { error: (req as CustomRequest).auth?.error },
        dataloaders: getDataLoaders(),
      };
    },
  });

  connectDB();

  await server.start();
  server.applyMiddleware({ app });

  const port = process.env.PORT || 5000;

  // eslint-disable-next-line no-promise-executor-return
  await new Promise<void>((resolve) => httpServer.listen({ port }, resolve));
  // eslint-disable-next-line no-console
  console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);
}

startApolloServer();
