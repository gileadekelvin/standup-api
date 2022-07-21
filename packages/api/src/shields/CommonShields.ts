import { allow } from 'graphql-shield';

export const CommonShields = {
  Mutation: {
    login: allow,
  },
  LoginPayload: allow,
};
