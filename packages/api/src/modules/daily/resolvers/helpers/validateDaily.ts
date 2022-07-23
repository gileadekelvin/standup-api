import { DailyModel } from '@standup/common';
import { GraphQLContext } from '../../../../types/GraphQLContext';

export const validateDaily = async (id: string, ctx: GraphQLContext) => {
  const daily = await DailyModel.findById(id);
  if (!daily) {
    return { Error: ['Daily not found'] };
  }
  if (daily.author.userId.toString() !== ctx.user?.id) {
    return { Error: ['User not allowed'] };
  }

  return { daily };
};
