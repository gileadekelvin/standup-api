import { GraphQLContext } from '../types/GraphQLContext';

import { loadUser } from './user/User.loader';
import { loadTeam } from './team/Team.loader';
import { loadDaily } from './daily/Daily.loader';

export const getDataLoaders = (): GraphQLContext['dataloaders'] => {
  return {
    User: loadUser,
    Team: loadTeam,
    Daily: loadDaily,
  };
};
