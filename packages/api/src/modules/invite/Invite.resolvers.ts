import { MutationResolvers, QueryResolvers } from '../schema';

import { acceptInvite } from './resolvers/acceptInvite';
import { getInviteLink } from './resolvers/getInviteLink';

const Mutation: MutationResolvers = {
  acceptInvite: (_, args, ctx) => acceptInvite(args, ctx),
};

const Query: QueryResolvers = {
  getInvite: (_, __, ctx) => getInviteLink(ctx),
};

export default {
  ...{ Mutation },
  Query,
};
