import { Resolvers } from '../schema';

import { createBook } from './mutations/createBook';

const book: Resolvers = {
  Book: {
    author: (parent) => parent.author?.toUpperCase() as string,
  },
  Mutation: {
    createBook: async (_, args) => createBook(args),
  },
};

export default {
  ...book,
};
