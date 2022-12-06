import jwt from 'jsonwebtoken';

import { API_SECRET } from '../../../config';
import { GraphQLContext } from '../../../types/GraphQLContext';

export const getInviteLink = (ctx: GraphQLContext) => {
  if (ctx.user.role.name !== 'admin') {
    return null;
  }

  const inviteLink = jwt.sign(
    {
      invitorId: ctx.user?._id,
      teamId: ctx.user.teamId,
    },
    API_SECRET as string,
    {
      algorithm: 'HS256',
      subject: ctx.user?._id.toString(),
      expiresIn: '1d',
    },
  );

  return inviteLink;
};
