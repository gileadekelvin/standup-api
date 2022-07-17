import { UserModel } from '@standup/common';

import { createSimpleDataLoader } from '../../helpers/createSimpleDataLoader';

export const loadUser = createSimpleDataLoader(UserModel);
