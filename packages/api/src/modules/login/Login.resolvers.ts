import { Resolvers } from '../schema';

import { login as loginUser } from './resolvers/login';

const login: Resolvers = {
  Mutation: {
    login: async (_, args) => loginUser(args),
  },
};

export default {
  ...login,
};
