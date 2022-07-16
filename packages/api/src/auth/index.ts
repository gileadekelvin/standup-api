import jwt from 'jsonwebtoken';

import { JWTDecoded } from '../types/JWTDecoded';

export const verifyJwtUser = async (token: string) => {
  const jwtDecoded = jwt.verify(token, process.env.API_SECRET as string, {
    algorithms: ['HS256'],
  });
  return jwtDecoded as JWTDecoded;
};
