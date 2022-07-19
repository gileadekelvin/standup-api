import { toGlobalId } from 'graphql-relay';

import { TeamResolvers } from '../schema';
import { loadDailies } from '../daily/Daily.loader';

const Team: TeamResolvers = {
  id: (parent) => toGlobalId('Team', parent._id),
  dailies: (parent, args) => loadDailies(parent._id, args),
};

export default {
  Team,
};
