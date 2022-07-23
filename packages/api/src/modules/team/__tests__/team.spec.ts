import { gql } from 'graphql-tag';
import { toGlobalId } from 'graphql-relay';
import { createUser, User, Team, connectDatabase, closeDatabase } from '@standup/common';

import { GraphQLContext } from '../../../types/GraphQLContext';
import { schema, getTestContext, graphql } from '../../../tests/utils';

const query = gql`
  query getUser {
    me {
      id
      team {
        _id
        id
        name
        companyId
        createdAt
        updatedAt
      }
    }
  }
`;

let user: User;
let team: Team;
let context: GraphQLContext;

describe('Test get team', () => {
  beforeAll(async () => {
    await connectDatabase();

    const userInfo = await createUser();

    user = userInfo.user;
    team = userInfo.team;

    context = getTestContext(user);
  });

  afterAll(async () => {
    await closeDatabase();
  });

  test('should return team info', async () => {
    const response = await graphql({
      schema,
      query,
      context,
    });

    expect(response).toBeDefined();
    expect(response?.errors).toBeUndefined();

    expect(response?.data?.me.id).toEqual(toGlobalId('User', user.id));
    expect(response?.data?.me.team._id).toEqual(user.teamId.toString());
    expect(response?.data?.me.team.id).toEqual(toGlobalId('Team', user.teamId.toString()));
    expect(response?.data?.me.team.name).toEqual(team.name);
    expect(response?.data?.me.team.companyId).toEqual(team.companyId.toString());
    expect(response?.data?.me.team.createdAt).toEqual(team.createdAt);
    expect(response?.data?.me.team.updatedAt).toEqual(team.updatedAt);
  });
});
