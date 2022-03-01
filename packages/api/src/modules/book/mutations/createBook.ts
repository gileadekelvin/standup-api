import { BookModel } from '@package/common';

import { MutationCreateBookArgs } from '../../schema';

export const createBook = async (args: MutationCreateBookArgs) => {
  const newBook = await BookModel.create(args.input);

  return { Book: newBook };
};
