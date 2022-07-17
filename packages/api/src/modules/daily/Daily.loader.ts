import { DailyModel } from '@standup/common';

export const loadDailies = async (teamId: string) => {
  const dailies = await DailyModel.find({ teamId });
  return dailies;
};
