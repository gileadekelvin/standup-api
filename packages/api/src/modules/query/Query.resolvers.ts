import { QueryResolvers } from '../schema';
import { loadNode } from '../node/Node.loader';

const Query: QueryResolvers = {
  me: (_, __, ctx) => ctx.dataloaders.User.load(ctx.user.id),
  node: (_, args, ctx) => loadNode(args.id, ctx),
};

export default {
  Query,
};
