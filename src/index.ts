import { ApolloServer, gql } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import express from 'express';
import http from 'http';

const typeDefsC = gql`
  type Book {
    title: String
    author: String
  }

  type Query {
    books: [Book]
  }
`;

const books = [
  {
    title: 'The Awakenings',
    author: 'Kate Chopins',
  },
  {
    title: 'City of Glass',
    author: 'Paul sdahdjad',
  },
];

const resolversC = {
  Query: {
    books: () => books,
  },
};

async function startApolloServer(typeDefs: any, resolvers: any) {
  const app = express();
  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();
  server.applyMiddleware({ app });

  // eslint-disable-next-line no-promise-executor-return
  await new Promise<void>((resolve) => httpServer.listen({ port: 5000 }, resolve));
  // eslint-disable-next-line no-console
  console.log(`🚀 Server ready at http://localhost:5000${server.graphqlPath}`);
}

startApolloServer(typeDefsC, resolversC);
