import jwt from 'jsonwebtoken';
import Faker from 'faker';
import { gql } from 'graphql-tag';
import { createUser, User, connectDatabase, closeDatabase, TeamModel } from '@standup/common';

import { schema, getTestContext, graphql } from '../../../tests/utils';

jest.mock('jsonwebtoken', () => ({
  ...jest.requireActual('jsonwebtoken'),
  verify: jest.fn().mockReturnValue({ foo: 'bar' }),
}));

const query = gql`
  query inviteInfo($inviteLink: String!) {
    getInviteInfo(inviteLink: $inviteLink) {
      UserInvitor
      TeamName
    }
  }
`;

let user: User;

describe('Test getInviteInfo', () => {
  beforeAll(async () => {
    await connectDatabase();
    user = (await createUser()).user;

    (jwt.verify as jest.Mock).mockReturnValue({ invitorId: user.id, teamId: user.teamId });
  });

  afterAll(async () => {
    (jwt.verify as jest.Mock).mockClear();
    await closeDatabase();
  });

  test('should show invite info', async () => {
    const newUser = (await createUser()).user;
    const contextNewUser = getTestContext(newUser);

    const inviteLink = Faker.datatype.uuid();

    const response = await graphql({
      schema,
      query,
      context: contextNewUser,
      variables: { inviteLink },
    });

    expect(response).toBeDefined();
    expect(response?.errors).toBeUndefined();

    const team = await TeamModel.findById(user.teamId);

    expect(response?.data.getInviteInfo.UserInvitor).toEqual(user.name);
    expect(response?.data.getInviteInfo.TeamName).toEqual(team?.name);
  });
});
