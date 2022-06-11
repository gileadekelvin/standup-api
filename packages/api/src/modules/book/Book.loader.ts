import { BookModel } from '@package/common';

import { QueryBooksArgs } from '../schema';

export const loadBooks = async (args: QueryBooksArgs) => {
  const filters = {
    ...(args.creatorId ? { creatorId: args.creatorId } : {}),
  };
  const books = await BookModel.find(filters);
  return books;
};
