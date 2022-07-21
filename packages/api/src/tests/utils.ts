import { ExecutionResult, graphql as graphqlServer, GraphQLArgs, ASTNode, print } from 'graphql';
import { User } from '@standup/common';

import { buildCompleteSchema } from '../buildSchema';
import { getDataLoaders } from '../modules/loaders';
import { GraphQLContext } from '../types/GraphQLContext';

export const schema = buildCompleteSchema();

export const getTestContext = (user: User): GraphQLContext => {
  return {
    user,
    auth: { error: null },
    dataloaders: getDataLoaders(),
  };
};

export const graphql = async (args: {
  schema: GraphQLArgs['schema'];
  query: ASTNode;
  context: GraphQLArgs['contextValue'];
  variables?: GraphQLArgs['variableValues'];
}) => {
  return graphqlServer({
    schema: args.schema,
    source: print(args.query),
    contextValue: args.context,
    variableValues: args.variables,
  }) as ExecutionResult<any>;
};
