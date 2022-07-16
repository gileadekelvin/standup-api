import { resolve } from 'path';

import { makeExecutableSchema } from '@graphql-tools/schema';
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';
import { loadFilesSync } from '@graphql-tools/load-files';
import { applyMiddleware } from 'graphql-middleware';

import shields from './shields/index';

export const getTypes = () => {
  return loadFilesSync<string>(resolve(__dirname, 'modules', '**', '*'), {
    extensions: ['gql'],
  });
};

export const getResolvers = () => {
  return loadFilesSync<string>(resolve(__dirname, 'modules', '**', '*'), {
    extensions: ['.resolvers.js', '.resolvers.ts'],
  });
};

const build = (typePaths: string[], resolverPaths: string[]) => {
  return {
    typeDefs: mergeTypeDefs(typePaths),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolvers: mergeResolvers(resolverPaths as any[]),
  };
};

const buildSchema = () => {
  const typePaths = getTypes();
  const resolverPaths = getResolvers();
  const schema = build(typePaths, resolverPaths);
  return schema;
};

export const buildCompleteSchema = () => {
  const schemaBuilded = buildSchema();
  const executableSchema = makeExecutableSchema({
    typeDefs: schemaBuilded.typeDefs,
    resolvers: schemaBuilded.resolvers,
  });

  return applyMiddleware(executableSchema, shields);
};
