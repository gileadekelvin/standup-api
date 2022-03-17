import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import express from 'express';
import http from 'http';
import { connectDB } from '@package/common';

import { buildCompleteSchema } from './buildSchema';

async function startApolloServer() {
  const app = express();
  const httpServer = http.createServer(app);

  const schema = buildCompleteSchema();

  const server = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
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
