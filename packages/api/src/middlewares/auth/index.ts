import { Request, Response, NextFunction } from 'express';

import { verifyJwtUser } from '../../auth';

import { CustomRequest } from '../../types/CustomRequest';

export function getAuthMiddleware() {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (req.headers.authorization) {
        const user = await verifyJwtUser(req.headers.authorization as string);
        (req as CustomRequest).auth = { user, error: null };
      }
      return next();
    } catch (error) {
      (req as CustomRequest).auth = { user: null, error: error.message };
      return next();
    }
  };
}
