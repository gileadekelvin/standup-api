import { toGlobalId } from 'graphql-relay';

import { DailyResolvers } from '../schema';

const Daily: DailyResolvers = {
  id: (parent) => toGlobalId('Daily', parent._id),
  authorInfo: (_, __, ctx) => ctx.dataloaders.User.load(ctx.user.id),
};

export default {
  Daily,
};
