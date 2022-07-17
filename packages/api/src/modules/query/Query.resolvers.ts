import { QueryResolvers } from '../schema';
import { loadBooks } from '../book/Book.loader';
import { loadNode } from '../node/Node.loader';

const Query: QueryResolvers = {
  books: (_, args) => {
    return loadBooks(args);
  },
  me: (_, __, ctx) => ctx.dataloaders.User.load(ctx.user.id),
  node: (_, args, ctx) => loadNode(args.id, ctx),
};

export default {
  Query,
};
