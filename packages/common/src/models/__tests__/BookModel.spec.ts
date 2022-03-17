import Faker from 'faker';

import { BookModel } from '../Book.model';
import { connectDatabase, closeDatabase } from '../../tests/database';

describe('Test BookModel', () => {
  beforeAll(async () => {
    await connectDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  test('should create a Book only with title', async () => {
    const title = Faker.name.title();

    const createdBook = await BookModel.create({
      title,
    });

    expect(createdBook).toBeDefined();
    expect(createdBook.title).toBe(title);
    expect(createdBook.author).toBeUndefined();
    expect(createdBook.page).toBeUndefined();
  });

  test('Should create a Book with more fields', async () => {
    const book = {
      title: Faker.name.title(),
      author: Faker.name.firstName(),
      page: Faker.datatype.number(),
    };
    const createdBook = await BookModel.create(book);

    expect(createdBook).toBeDefined();
    expect(createdBook.title).toBe(book.title);
    expect(createdBook.author).toBe(book.author);
    expect(createdBook.page).toBe(book.page);
  });
});
