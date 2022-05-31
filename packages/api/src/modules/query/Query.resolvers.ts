import { Resolvers } from '../schema';
import { loadBooks } from '../book/Book.loader';

const Query: Resolvers = {
  Query: {
    books: (_, args) => {
      return loadBooks(args);
    },
  },
};

export default {
  ...Query,
};
