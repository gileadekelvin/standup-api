import { fromGlobalId } from 'graphql-relay';
import { DailyModel } from '@standup/common';
import * as Sentry from '@sentry/node';

import { GraphQLContext } from '../../../types/GraphQLContext';
import { MutationDeleteDailyArgs } from '../../schema';

import { validateDaily } from './helpers/validateDaily';

export const deleteDaily = async (args: MutationDeleteDailyArgs, ctx: GraphQLContext) => {
  const { id } = fromGlobalId(args.input.id);

  const { Error } = await validateDaily(id, ctx);
  if (Error) {
    return { Error };
  }

  try {
    const dailyDeleted = await DailyModel.findByIdAndDelete(id);
    return { Daily: dailyDeleted };
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
