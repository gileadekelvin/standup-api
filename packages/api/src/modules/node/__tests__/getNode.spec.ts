import { gql } from 'graphql-tag';
import { toGlobalId } from 'graphql-relay';
import {
  createUser,
  User,
  Daily,
  DailyModel,
  connectDatabase,
  closeDatabase,
} from '@standup/common';

import { GraphQLContext } from '../../../types/GraphQLContext';
import { schema, getTestContext, graphql } from '../../../tests/utils';

const query = gql`
  query getNode($id: ID!) {
    node(id: $id) {
      id
      ... on Daily {
        _id
        id
      }
    }
  }
`;

let user: User;
let daily: Daily;
let context: GraphQLContext;

describe('Test node field', () => {
  beforeAll(async () => {
    await connectDatabase();

    user = (await createUser()).user;

    daily = await DailyModel.create({
      yesterday: [],
      today: [],
      blocks: [],
      teamId: user.teamId,
      author: {
        userId: user._id,
        name: user.name,
      },
    });

    context = getTestContext(user);
  });

  afterAll(async () => {
    await closeDatabase();
  });

  test('should daily node', async () => {
    const input = {
      id: toGlobalId('Daily', daily.id),
    };
    const response = await graphql({
      schema,
      query,
      context,
      variables: input,
    });

    expect(response).toBeDefined();
    expect(response?.errors).toBeUndefined();

    expect(response.data?.node.id).toEqual(input.id);
    expect(response.data?.node._id).toEqual(daily._id.toString());
  });
});
