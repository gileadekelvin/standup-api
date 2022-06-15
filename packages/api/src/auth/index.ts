import jwt from 'jsonwebtoken';

export const verifyJwtUser = async (token: string) => {
  const jwtDecoded = jwt.verify(token, process.env.API_SECRET as string, {
    algorithms: ['HS256'],
  });
  const user = { token: jwtDecoded };
  return user;
};
