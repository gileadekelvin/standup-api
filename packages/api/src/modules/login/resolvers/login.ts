import jwt from 'jsonwebtoken';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { UserModel, CompanyModel, TeamModel } from '@standup/common';

import { API_SECRET, GOOGLE_CLIENT_ID } from '../../../config';
import { MutationLoginArgs } from '../../schema';

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

const verifyGoogleToken = async (token: string) => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  return payload;
};

const findOrCreateUser = async (payload: TokenPayload) => {
  const user = await UserModel.findOne({
    googleId: payload?.sub,
  });

  if (!user) {
    const company = await CompanyModel.create({ name: `${payload?.name}'s Company` });
    const team = await TeamModel.create({
      name: `${payload?.name}'s Team`,
      companyId: company._id,
    });
    const newUser = await UserModel.create({
      googleId: payload?.sub,
      name: payload?.name,
      email: payload?.email,
      verified: payload?.email_verified,
      role: { name: 'admin', level: 'organization' },
      teamId: team._id,
    });
    return newUser;
  }

  return user;
};

export const login = async (args: MutationLoginArgs) => {
  const payload = await verifyGoogleToken(args.token);

  if (!payload) {
    return { Error: ['Unable to login'] };
  }

  const user = await findOrCreateUser(payload);

  const apiToken = jwt.sign({ userId: user?._id }, API_SECRET as string, {
    algorithm: 'HS256',
    subject: user?._id.toString(),
    expiresIn: '7d',
  });

  return { token: apiToken };
};
