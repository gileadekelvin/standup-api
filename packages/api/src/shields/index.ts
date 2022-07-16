import { allow, rule, shield } from 'graphql-shield';
import { AuthenticationError } from 'apollo-server-core';

const isAuthenticated = rule({ cache: 'contextual' })(async (_parent, _args, ctx) => {
  return !!ctx.user;
});

const shields = shield(
  {
    Mutation: {
      login: allow,
    },
    LoginPayload: allow,
  },
  {
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
  },
);

export default shields;
