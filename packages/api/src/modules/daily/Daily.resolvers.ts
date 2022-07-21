import { toGlobalId } from 'graphql-relay';

import { DailyResolvers, MutationResolvers } from '../schema';

import { createDaily } from './resolvers/createDaily';

const Mutation: MutationResolvers = {
  createDaily: (_, args, ctx) => createDaily(args, ctx),
};

const Daily: DailyResolvers = {
  id: (parent) => toGlobalId('Daily', parent._id),
  authorInfo: (_, __, ctx) => ctx.dataloaders.User.load(ctx.user.id),
};

export default {
  ...{ Mutation },
  Daily,
};
