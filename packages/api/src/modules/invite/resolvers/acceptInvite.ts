import { UserModel, TeamChangeLogModel } from '@standup/common';
import jwt from 'jsonwebtoken';
import * as Sentry from '@sentry/node';

import { GraphQLContext } from '../../../types/GraphQLContext';
import { MutationAcceptInviteArgs } from '../../schema';

export const verifyJwtInvite = async (token: string) => {
  const jwtDecoded = jwt.verify(token, process.env.API_SECRET as string, {
    algorithms: ['HS256'],
  });
  return jwtDecoded as {
    invitorId: string;
    teamId: string;
  };
};

export const acceptInvite = async (args: MutationAcceptInviteArgs, ctx: GraphQLContext) => {
  try {
    const decodedToken = await verifyJwtInvite(args.input.inviteLink);

    const foundedUser = await UserModel.findById(ctx.user.id);

    if (foundedUser?.teamId.toString() === decodedToken.teamId) {
      return { Error: ['You already is a member of this team'] };
    }

    const userUpdated = await UserModel.findByIdAndUpdate(
      ctx.user.id,
      { teamId: decodedToken.teamId, role: { name: 'member' } },
      { new: true },
    );

    await TeamChangeLogModel.create({
      userId: ctx.user.id,
      oldTeamId: foundedUser?.teamId,
      newTeamId: decodedToken.teamId,
    });

    return { User: userUpdated };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    Sentry.captureException(error, {
      extra: {
        ctx,
        args,
      },
    });
    return { Error: ['Could not accept invite', error.message] };
  }
};
