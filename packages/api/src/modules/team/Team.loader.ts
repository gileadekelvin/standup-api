import { TeamModel } from '@standup/common';

import { createSimpleDataLoader } from '../../helpers/createSimpleDataLoader';

export const loadTeam = createSimpleDataLoader(TeamModel);
