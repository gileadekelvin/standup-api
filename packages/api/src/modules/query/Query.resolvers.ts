import { Resolvers } from '../schema';
import { loadBooks } from '../book/Book.loader';

const Query: Resolvers = {
  Query: {
    books: (_, args) => {
      return loadBooks(args);
    },
    me: (_, __, ctx) => ctx.dataloaders.user.load(ctx.user.id),
  },
};

export default {
  ...Query,
};
