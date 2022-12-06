import { QueryResolvers } from '../schema';

import { getInviteLink } from './resolvers/getInviteLink';

const Query: QueryResolvers = {
  getInvite: (_, __, ctx) => getInviteLink(ctx),
};

export default {
  Query,
};
