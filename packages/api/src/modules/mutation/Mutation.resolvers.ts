import { Resolvers, MutationTestArgs } from '../schema';

const Mutation: Resolvers = {
  Mutation: {
    test: (_, args: MutationTestArgs) => args.input || 'no input',
  },
};

export default {
  ...Mutation,
};
