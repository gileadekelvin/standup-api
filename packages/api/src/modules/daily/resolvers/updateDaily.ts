import { fromGlobalId } from 'graphql-relay';
import { DailyModel } from '@standup/common';
import * as Sentry from '@sentry/node';

import { GraphQLContext } from '../../../types/GraphQLContext';
import { MutationUpdateDailyArgs } from '../../schema';

import { validateDaily } from './helpers/validateDaily';

export const updateDaily = async (args: MutationUpdateDailyArgs, ctx: GraphQLContext) => {
  const { id } = fromGlobalId(args.input.id);

  const { Error } = await validateDaily(id, ctx);
  if (Error) {
    return { Error };
  }

  try {
    const dailyUpdated = await DailyModel.findByIdAndUpdate(id, args.input, { new: true });
    return { Daily: dailyUpdated };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    Sentry.captureException(error, {
      extra: {
        ctx,
        args,
      },
    });
    return { Error: ['Could not update Daily', error.message] };
  }
};
