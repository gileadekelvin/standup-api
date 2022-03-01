import { BookModel } from '@package/common';

export const loadBooks = async () => {
  const books = await BookModel.find({});

  return books;
};
