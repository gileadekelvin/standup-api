import { MutationResolvers, QueryResolvers } from '../schema';

import { acceptInvite } from './resolvers/acceptInvite';
import { getInviteInfo } from './resolvers/getInviteInfo';
import { getInviteLink } from './resolvers/getInviteLink';

const Mutation: MutationResolvers = {
  acceptInvite: (_, args, ctx) => acceptInvite(args, ctx),
};

const Query: QueryResolvers = {
  getInvite: (_, __, ctx) => getInviteLink(ctx),
  getInviteInfo: (_, args) => getInviteInfo(args),
};

export default {
  ...{ Mutation },
  Query,
};
