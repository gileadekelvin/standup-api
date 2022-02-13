import { Resolvers } from '../schema';
import { loadBooks } from '../book/Book.loader';

const Query: Resolvers = {
  Query: {
    books: () => loadBooks(),
  },
};

export default {
  ...Query,
};
