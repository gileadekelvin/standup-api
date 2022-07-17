import { loadUser } from './user/User.loader';
import { loadTeam } from './team/Team.loader';
import { loadDaily } from './daily/Daily.loader';
import { GraphQLContext } from '../types/GraphQLContext';

export const getDataLoaders = (): GraphQLContext['dataloaders'] => {
  return {
    User: loadUser,
    Team: loadTeam,
    Daily: loadDaily,
  };
};
