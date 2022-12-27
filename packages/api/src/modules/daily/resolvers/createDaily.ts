import { DailyI, DailyModel } from '@standup/common';
import * as Sentry from '@sentry/node';

import { GraphQLContext } from '../../../types/GraphQLContext';
import { MutationCreateDailyArgs } from '../../schema';

export const createDaily = async (args: MutationCreateDailyArgs, ctx: GraphQLContext) => {
  const author: DailyI['author'] = {
    userId: ctx.user?.id,
    name: ctx.user?.name,
  };

  const daily: Partial<DailyI> = {
    ...args.input,
    teamId: ctx.user?.teamId,
    author,
  };

  try {
    const dailyCreated = await DailyModel.create(daily);
    return { Daily: dailyCreated };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    Sentry.captureException(error, {
      extra: {
        ctx,
        args,
      },
    });
    return { Error: ['Could not create Daily', error.message] };
  }
};
