import Faker from 'faker';
import { graphql, ExecutionResult, print } from 'graphql';
import { gql } from 'graphql-tag';

import {
  createUser,
  User,
  BookModel,
  IBook,
  connectDatabase,
  closeDatabase,
} from '@standup/common';

import { GraphQLContext } from '../../../types/GraphQLContext';
import { schema, getTestContext } from '../../../tests/utils';
import { Book } from '../../schema';

const query = gql`
  query getBooks($creatorId: ID) {
    books(creatorId: $creatorId) {
      _id
      title
      page
      author
      creatorId
    }
  }
`;

let user: User;
let context: GraphQLContext;
let book1: IBook;
let book2: IBook;

describe('Test query getBooks', () => {
  beforeAll(async () => {
    await connectDatabase();

    user = (await createUser()).user;

    context = getTestContext(user);

    book1 = await BookModel.create({
      title: Faker.name.title(),
      creatorId: Faker.datatype.uuid(),
    });

    book2 = await BookModel.create({
      title: Faker.name.title(),
      author: Faker.name.findName(),
      page: Faker.datatype.number(),
      creatorId: book1.creatorId,
    });
  });

  afterAll(async () => {
    await closeDatabase();
  });

  test('should return all books', async () => {
    const input = { creatorId: book1.creatorId };
    const response = (await graphql({
      schema,
      source: print(query),
      variableValues: input,
      contextValue: context,
    })) as ExecutionResult<{ books: Book[] }>;

    expect(response).toBeDefined();
    expect(response?.errors).toBeUndefined();

    expect(response.data?.books[0].title).toEqual(book1.title);
    expect(response.data?.books[0].author).toBeNull();
    expect(response.data?.books[0].page).toBeNull();
    expect(response.data?.books[0].creatorId).toEqual(book1.creatorId);

    expect(response.data?.books[1].title).toEqual(book2.title);
    expect(response.data?.books[1].author).toEqual(book2.author?.toUpperCase() as string);
    expect(response.data?.books[1].page).toEqual(book2.page);
    expect(response.data?.books[1].creatorId).toEqual(book1.creatorId);
  });
});
