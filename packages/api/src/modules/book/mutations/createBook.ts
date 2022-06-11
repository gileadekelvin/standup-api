import { BookModel } from '@standup/common';

import { MutationCreateBookArgs } from '../../schema';

export const createBook = async (args: MutationCreateBookArgs) => {
  try {
    const newBook = await BookModel.create(args.input);
    return { Book: newBook };
  } catch (e) {
    return { Error: [e.message] };
  }
};
