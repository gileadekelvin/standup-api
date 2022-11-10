import { DailyModel } from '@standup/common';

import { TeamDailiesArgs, DailyConnection } from '../schema';
import { offsetToCursor, getCursorPaginationQuery } from '../../helpers/cursor';
import { createSimpleDataLoader } from '../../helpers/createSimpleDataLoader';

import { parseDailyFilters } from './parsers/parseDailyFilters';

const emptyReturn = {
  totalCount: 0,
  pageInfo: {
    startCursor: null,
    endCursor: null,
    hasNextPage: false,
    hasPreviousPage: false,
  },
  edges: [],
};

const findDailies = async (teamId: string, args: TeamDailiesArgs) => {
  const paginateQuery = args.after ? getCursorPaginationQuery(args.after) : {};
  if (!paginateQuery) {
    return { totalCount: null, response: null };
  }

  const filters = parseDailyFilters(teamId, args);
  const query = {
    $and: [filters, paginateQuery],
  };

  const totalCount = await DailyModel.find(filters).countDocuments();

  const size = args.first + 1;
  const response = await DailyModel.find(query).sort({ createdAt: -1, _id: -1 }).limit(size).lean();

  return { totalCount, response };
};

export const loadDailies = async (
  teamId: string,
  args: TeamDailiesArgs,
): Promise<DailyConnection> => {
  const { totalCount, response } = await findDailies(teamId, args);
  if (!response) {
    return emptyReturn;
  }

  const slicedList = response.slice(0, args.first);
  const dailies = slicedList?.map((daily) => {
    return {
      cursor: offsetToCursor(daily.createdAt, daily._id.toString()),
      node: daily,
    };
  });

  return {
    totalCount,
    pageInfo: {
      startCursor: dailies?.[0]?.cursor ?? null,
      endCursor: dailies.length > 0 ? dailies[dailies.length - 1].cursor : null,
      hasNextPage: args.first > 0 && response.length > args.first,
      hasPreviousPage: false, // not supported yet
    },
    // TODO: need to provide a LeanDocument interface for DailyModel
    edges: dailies as any,
  };
};

export const loadDaily = createSimpleDataLoader(DailyModel);
