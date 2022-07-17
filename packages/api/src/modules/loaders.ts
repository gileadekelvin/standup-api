import { loadUser } from './user/User.loader';
import { loadTeam } from './team/Team.loader';

export const getDataLoaders = () => {
  return {
    user: loadUser,
    team: loadTeam,
  };
};
