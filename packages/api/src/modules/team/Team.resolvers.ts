import { TeamResolvers } from '../schema';
import { loadDailies } from '../daily/Daily.loader';

const Team: TeamResolvers = {
  dailies: (parent) => loadDailies(parent._id),
};

export default {
  Team,
};
