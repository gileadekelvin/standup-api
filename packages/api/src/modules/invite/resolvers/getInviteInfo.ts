import { TeamModel, UserModel } from '@standup/common';

import { QueryGetInviteInfoArgs } from '../../schema';

import { verifyJwtInvite } from './acceptInvite';

export const getInviteInfo = async (args: QueryGetInviteInfoArgs) => {
  const decodedToken = await verifyJwtInvite(args.inviteLink);

  const teamInfo = await TeamModel.findById(decodedToken.teamId);
  const userInfo = await UserModel.findById(decodedToken.invitorId);

  return {
    UserInvitor: userInfo?.name,
    TeamName: teamInfo?.name,
  };
};
