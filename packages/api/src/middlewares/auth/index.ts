import { Request, Response, NextFunction } from 'express';
import { UserModel } from '@standup/common';

import { verifyJwtUser } from '../../auth';
import { CustomRequest } from '../../types/CustomRequest';

const findUser = async (userId: string) => {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

export function getAuthMiddleware() {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (req.headers.authorization) {
        const verifiedToken = await verifyJwtUser(req.headers.authorization as string);
        const user = await findUser(verifiedToken.userId);
        (req as CustomRequest).auth = { user, error: null };
      }
      return next();
    } catch (error) {
      (req as CustomRequest).auth = { user: null, error: error.message };
      return next();
    }
  };
}
