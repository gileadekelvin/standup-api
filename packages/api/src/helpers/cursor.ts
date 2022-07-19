import { toGlobalId, fromGlobalId } from 'graphql-relay';
import { Daily } from '@standup/common';
import { FilterQuery } from 'mongoose';

export const offsetToCursor = (date: Date, id: string): string =>
  toGlobalId('Cursor', `${date.getTime()}:${id}`);

export const cursorToOffset = (cursor: string) => {
  const [createdAt, id] = fromGlobalId(cursor).id.split(':');
  return {
    createdAt,
    id,
  };
};

export const getCursorPaginationQuery = (cursor: string): FilterQuery<Daily> | null => {
  const { createdAt, id } = cursorToOffset(cursor);

  if (!id) {
    return null;
  }

  return {
    $or: [
      { createdAt: { $lt: createdAt } },
      {
        createdAt,
        _id: { $lt: id },
      },
    ],
  };
};
