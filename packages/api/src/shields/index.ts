import { shield, IRules } from 'graphql-shield';
import { AuthenticationError } from 'apollo-server-core';
import * as Sentry from '@sentry/node';

import { isAuthenticated } from './Rules';

export const getShield = (rules: IRules) => {
  return shield(rules, {
    debug: true,
    fallbackError(error, parent, args, ctx, info) {
      // eslint-disable-next-line no-console
      console.error(error);
      Sentry.captureException(error, {
        extra: {
          parent,
          ctx,
          args,
          info,
        },
      });
      if (error instanceof Error) {
        return error;
      }
      return new AuthenticationError('Not Authorized!');
    },
    fallbackRule: isAuthenticated,
  });
};
