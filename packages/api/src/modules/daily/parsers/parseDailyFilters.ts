import { FilterQuery } from 'mongoose';
import { Daily } from '@standup/common';
import { parseISO } from 'date-fns';
import { format, utcToZonedTime } from 'date-fns-tz';

import { TeamDailiesArgs, DailyFilters } from '../../schema';

const filterByAuthor = (userId: DailyFilters['UserId']): FilterQuery<Daily> | null => {
  if (userId) {
    return {
      'author.userId': userId,
    };
  }
  return null;
};

const filterByCreatedAt = (rangeDate: DailyFilters['RangeDate']): FilterQuery<Daily> | null => {
  if (rangeDate && rangeDate.startDate && rangeDate.endDate) {
    return {
      createdAt: {
        $gte: format(
          utcToZonedTime(parseISO(rangeDate.startDate), 'UTC'),
          'yyyy-MM-dd HH:mm',
        ),
        $lte: format(
          utcToZonedTime(parseISO(rangeDate.endDate), 'UTC'),
          'yyyy-MM-dd HH:mm',
        ),
      },
    };
  }
  return null;
};

export const parseDailyFilters = (teamId: string, args: TeamDailiesArgs): FilterQuery<Daily> => {
  const dailyFilter: Array<Record<string, unknown>> = [{ teamId }];

  const authorFilter = filterByAuthor(args.filters?.UserId);
  if (authorFilter) {
    dailyFilter.push(authorFilter);
  }

  const createdAtFilter = filterByCreatedAt(args.filters?.RangeDate);
  if (createdAtFilter) {
    dailyFilter.push(createdAtFilter);
  }

  return {
    $and: dailyFilter,
  };
};
