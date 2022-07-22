import { toGlobalId } from 'graphql-relay';

import { DailyResolvers, MutationResolvers } from '../schema';

import { createDaily } from './resolvers/createDaily';
import { updateDaily } from './resolvers/updateDaily';

const Mutation: MutationResolvers = {
  createDaily: (_, args, ctx) => createDaily(args, ctx),
  updateDaily: (_, args, ctx) => updateDaily(args, ctx),
};

const Daily: DailyResolvers = {
  id: (parent) => toGlobalId('Daily', parent._id),
  authorInfo: (_, __, ctx) => ctx.dataloaders.User.load(ctx.user.id),
};

export default {
  ...{ Mutation },
  Daily,
};
