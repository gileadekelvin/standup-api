import Faker from 'faker';
import { graphql, ExecutionResult, GraphQLSchema, print } from 'graphql';
import { gql } from 'graphql-tag';

import { BookModel, IBook, connectDatabase, closeDatabase } from '@package/common';

import { buildCompleteSchema } from '../../../buildSchema';
import { Book } from '../../schema';

const query = gql`
  query getBooks {
    books {
      _id
      title
      page
      author
    }
  }
`;

let schema: GraphQLSchema;
let book1: IBook;
let book2: IBook;

describe('Test query getBooks', () => {
  beforeAll(async () => {
    schema = buildCompleteSchema();
    await connectDatabase();

    book1 = await BookModel.create({
      title: Faker.name.title(),
    });

    book2 = await BookModel.create({
      title: Faker.name.title(),
      author: Faker.name.findName(),
      page: Faker.datatype.number(),
    });
  });

  afterAll(async () => {
    await closeDatabase();
  });

  test('should return all books', async () => {
    const response = (await graphql({
      schema,
      source: print(query),
    })) as ExecutionResult<{ books: Book[] }>;

    expect(response).toBeDefined();
    expect(response?.errors).toBeUndefined();

    expect(response.data?.books[0].title).toEqual(book1.title);
    expect(response.data?.books[0].author).toBeNull();
    expect(response.data?.books[0].page).toBeNull();

    expect(response.data?.books[1].title).toEqual(book2.title);
    expect(response.data?.books[1].author).toEqual(book2.author?.toUpperCase() as string);
    expect(response.data?.books[1].page).toEqual(book2.page);
  });
});
