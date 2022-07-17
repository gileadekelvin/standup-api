import { NodeResolvers } from '../schema';

const Node: NodeResolvers = {
  __resolveType(obj: any) {
    return obj?.constructor?.modelName ?? null;
  },
};

export default {
  Node,
};
