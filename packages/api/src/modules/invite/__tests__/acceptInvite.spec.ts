import jwt from 'jsonwebtoken';
import { toGlobalId } from 'graphql-relay';
import Faker from 'faker';
import { gql } from 'graphql-tag';
import {
  createUser,
  User,
  connectDatabase,
  closeDatabase,
  UserModel,
  TeamChangeLogModel,
} from '@standup/common';

import { schema, getTestContext, graphql } from '../../../tests/utils';

jest.mock('jsonwebtoken', () => ({
  ...jest.requireActual('jsonwebtoken'),
  verify: jest.fn().mockReturnValue({ foo: 'bar' }),
}));

const query = gql`
  mutation acceptInvite($input: AcceptInviteInput!) {
    acceptInvite(input: $input) {
      Error
      User {
        id
        teamId
      }
    }
  }
`;

let user: User;

describe('Test acceptInvite', () => {
  beforeAll(async () => {
    await connectDatabase();
    user = (await createUser()).user;

    (jwt.verify as jest.Mock).mockReturnValue({ invitorId: user.id, teamId: user.teamId });
  });

  afterAll(async () => {
    (jwt.verify as jest.Mock).mockClear();
    await closeDatabase();
  });

  test('should accept the invite', async () => {
    const newUser = (await createUser()).user;
    const contextNewUser = getTestContext(newUser);

    const input = {
      inviteLink: Faker.datatype.uuid(),
    };
    const response = await graphql({
      schema,
      query,
      context: contextNewUser,
      variables: { input },
    });

    expect(response).toBeDefined();
    expect(response?.errors).toBeUndefined();

    expect(response.data.acceptInvite.Error).toBeNull();
    expect(response.data.acceptInvite.User.id).toEqual(toGlobalId('User', newUser.id));
    expect(response.data.acceptInvite.User.teamId).toEqual(user.teamId.toString());

    const newUserFromDB = await UserModel.findById(newUser.id);
    expect(response.data.acceptInvite.User.teamId).toEqual(newUserFromDB?.teamId.toString());
    expect(newUser.teamId).not.toEqual(newUserFromDB?.teamId.toString());
    expect(newUser.role.name).toBe('admin');
    expect(newUserFromDB?.role.name).toBe('member');

    const log = await TeamChangeLogModel.find({ userId: newUser.id });
    expect(log).toHaveLength(1);
    expect(log[0].oldTeamId).toEqual(newUser.teamId);
    expect(log[0].newTeamId).toEqual(newUserFromDB?.teamId);
  });
});
