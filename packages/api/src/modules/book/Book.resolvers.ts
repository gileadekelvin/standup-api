import { Resolvers } from '../schema';

const book: Resolvers = {
  Book: {
    page: () => Math.floor(Math.random() * 100),
  },
};

export default {
  ...book,
};
