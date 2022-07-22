import { fromGlobalId } from 'graphql-relay';
import { DailyModel } from '@standup/common';

import { GraphQLContext } from '../../../types/GraphQLContext';
import { MutationUpdateDailyArgs } from '../../schema';

export const updateDaily = async (args: MutationUpdateDailyArgs, ctx: GraphQLContext) => {
  const { id } = fromGlobalId(args.input.id);

  const daily = await DailyModel.findById(id);
  if (!daily) {
    return { Error: ['Daily not found'] };
  }
  if (daily.author.userId.toString() !== ctx.user?.id) {
    return { Error: ['User not allowed'] };
  }

  try {
    const dailyUpdated = await DailyModel.findByIdAndUpdate(id, args.input, { new: true });
    return { Daily: dailyUpdated };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return { Error: ['Could not update Daily', error.message] };
  }
};
