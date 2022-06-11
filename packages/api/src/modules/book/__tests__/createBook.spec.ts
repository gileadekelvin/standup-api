import Faker from 'faker';
import { graphql, ExecutionResult, GraphQLSchema, print } from 'graphql';
import { gql } from 'graphql-tag';

import { connectDatabase, closeDatabase } from '@package/common';

import { buildCompleteSchema } from '../../../buildSchema';
import { CreateBookPayload } from '../../schema';

const query = gql`
  mutation createBook($input: CreateBookInput!) {
    createBook(input: $input) {
      Error
      Book {
        _id
        title
        page
        author
      }
    }
  }
`;

let schema: GraphQLSchema;

describe('Test createBook', () => {
  beforeAll(async () => {
    schema = buildCompleteSchema();
    await connectDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  test('should create a Book only with title', async () => {
    const input = { title: Faker.name.title() };

    const response = (await graphql({
      schema,
      source: print(query),
      variableValues: { input },
    })) as ExecutionResult<{ createBook: CreateBookPayload }>;

    expect(response).toBeDefined();
    expect(response?.errors).toBeUndefined();

    expect(response?.data?.createBook?.Book?.title).toEqual(input.title);
    expect(response?.data?.createBook?.Book?.page).toBeNull();
    expect(response?.data?.createBook?.Book?.author).toBeNull();
  });

  test('should create a Book with more fields', async () => {
    const input = {
      title: Faker.name.title(),
      author: Faker.name.findName(),
      page: Faker.datatype.number(),
    };

    const response = (await graphql({
      schema,
      source: print(query),
      variableValues: { input },
    })) as ExecutionResult<{ createBook: CreateBookPayload }>;

    expect(response).toBeDefined();
    expect(response?.errors).toBeUndefined();

    expect(response?.data?.createBook?.Book?.title).toEqual(input.title);
    expect(response?.data?.createBook?.Book?.page).toEqual(input.page);
    expect(response?.data?.createBook?.Book?.author).toEqual(input.author.toUpperCase() as string);
  });
});
