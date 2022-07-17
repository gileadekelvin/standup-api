import { toGlobalId } from 'graphql-relay';

import { UserResolvers } from '../schema';

const User: UserResolvers = {
  id: (parent) => toGlobalId('User', parent._id),
  team: (parent, _, ctx) => ctx.dataloaders.Team.load(parent.teamId.toString()),
};

export default {
  User,
};
