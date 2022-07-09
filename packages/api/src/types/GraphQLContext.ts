import { User } from '@standup/common';

export type GraphQLContext = {
  user: User;
  auth: { error: string | null };
};
