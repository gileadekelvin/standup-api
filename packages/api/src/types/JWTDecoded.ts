export type JWTDecoded = {
  userId: string;
  exp: number;
  iat: number;
  sub: string;
};
