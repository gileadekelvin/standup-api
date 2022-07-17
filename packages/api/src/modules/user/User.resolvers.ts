import { UserResolvers } from '../schema';

const User: UserResolvers = {
  id: (parent) => parent._id,
  team: (parent, _, ctx) => ctx.dataloaders.team.load(parent.teamId.toString()),
};

export default {
  User,
};
