import { User } from '@standup/common';

import { buildCompleteSchema } from '../buildSchema';
import { getDataLoaders } from '../modules/loaders';
import { GraphQLContext } from '../types/GraphQLContext';

export const schema = buildCompleteSchema();

export const getTestContext = (user: User): GraphQLContext => {
  return {
    user,
    auth: { error: null },
    dataloaders: getDataLoaders(),
  };
};
