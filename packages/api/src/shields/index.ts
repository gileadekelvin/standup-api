import { shield, IRules } from 'graphql-shield';
import { AuthenticationError } from 'apollo-server-core';

import { isAuthenticated } from './Rules';

export const getShield = (rules: IRules) => {
  return shield(rules, {
    debug: true,
    fallbackError(error, _parent, _args, _ctx, _info) {
      // eslint-disable-next-line no-console
      console.error(error);
      if (error instanceof Error) {
        return error;
      }
      return new AuthenticationError('Not Authorized!');
    },
    fallbackRule: isAuthenticated,
  });
};
