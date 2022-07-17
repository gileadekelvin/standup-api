import { DailyModel } from '@standup/common';

import { createSimpleDataLoader } from '../../helpers/createSimpleDataLoader';

export const loadDailies = async (teamId: string) => {
  const dailies = await DailyModel.find({ teamId });
  return dailies;
};

export const loadDaily = createSimpleDataLoader(DailyModel);
