import { fromGlobalId } from 'graphql-relay';

import { GraphQLContext } from '../../types/GraphQLContext';

export const loadNode = (nodeId: string, ctx: GraphQLContext) => {
  const { type, id } = fromGlobalId(nodeId);

  if (type && id) {
    return ctx.dataloaders[type as keyof GraphQLContext['dataloaders']].load(id);
  }

  return null;
};
