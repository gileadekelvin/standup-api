import { graphql, ExecutionResult, print } from 'graphql';
import { gql } from 'graphql-tag';
import { toGlobalId } from 'graphql-relay';
import { createUser, User, connectDatabase, closeDatabase } from '@standup/common';

import { GraphQLContext } from '../../../types/GraphQLContext';
import { schema, getTestContext } from '../../../tests/utils';

const query = gql`
  query getUser {
    me {
      _id
      id
      bio
      email
      name
      createdAt
      updatedAt
      role {
        name
        level
      }
      teamId
      verified
    }
  }
`;

let user: User;
let context: GraphQLContext;

describe('Test query User Me', () => {
  beforeAll(async () => {
    await connectDatabase();

    user = (await createUser()).user;

    context = getTestContext(user);
  });

  afterAll(async () => {
    await closeDatabase();
  });

  test('should return user info', async () => {
    const response = (await graphql({
      schema,
      source: print(query),
      contextValue: context,
    })) as ExecutionResult<{ me: User }>;

    expect(response).toBeDefined();
    expect(response?.errors).toBeUndefined();

    expect(response?.data?.me.id).toEqual(toGlobalId('User', user.id));
    expect(response?.data?.me._id).toEqual(user._id.toString());
    expect(response?.data?.me.name).toEqual(user.name);
    expect(response?.data?.me.bio).toEqual(user.bio);
    expect(response?.data?.me.email).toEqual(user.email);
    expect(response?.data?.me.role.name).toEqual(user.role.name);
    expect(response?.data?.me.role.level).toEqual(user.role.level);
    expect(response?.data?.me.createdAt).toEqual(user.createdAt);
    expect(response?.data?.me.updatedAt).toEqual(user.updatedAt);
    expect(response?.data?.me.verified).toBeNull();
    expect(response?.data?.me.teamId).toEqual(user.teamId.toString());
  });
});
