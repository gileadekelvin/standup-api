import Faker from 'faker';
import { graphql, ExecutionResult, GraphQLSchema, print } from 'graphql';
import { gql } from 'graphql-tag';

import { connectDatabase, closeDatabase } from '@standup/common';

import { buildCompleteSchema } from '../../../buildSchema';
import { LoginPayload } from '../../schema';

const query = gql`
  mutation login($name: String!) {
    login(name: $name) {
      token
    }
  }
`;

let schema: GraphQLSchema;

describe('Test login', () => {
  beforeAll(async () => {
    schema = buildCompleteSchema();
    await connectDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  test('should login user', async () => {
    const input = { name: Faker.name.title() };

    const response = (await graphql({
      schema,
      source: print(query),
      variableValues: input,
    })) as ExecutionResult<{ login: LoginPayload }>;

    expect(response).toBeDefined();
    expect(response?.errors).toBeUndefined();

    expect(response?.data?.login.token).toBeDefined();
  });
});
