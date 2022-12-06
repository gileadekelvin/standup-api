import { gql } from 'graphql-tag';
import { createUser, User, connectDatabase, closeDatabase } from '@standup/common';

import { GraphQLContext } from '../../../types/GraphQLContext';
import { schema, getTestContext, graphql } from '../../../tests/utils';
import { verifyJwtUser } from '../../../auth';

const query = gql`
  query getInviteLink {
    getInvite
  }
`;

let user: User;
let context: GraphQLContext;

describe('Test getInvite', () => {
  beforeAll(async () => {
    await connectDatabase();
    user = (await createUser()).user;
    context = getTestContext(user);
  });

  afterAll(async () => {
    await closeDatabase();
  });

  test('should get invite link', async () => {
    const response = await graphql({
      schema,
      query,
      context,
    });

    expect(response).toBeDefined();
    expect(response?.errors).toBeUndefined();

    const decoded: unknown = await verifyJwtUser(response.data.getInvite);

    expect((decoded as { invitorId: string; teamId: string }).invitorId).toEqual(user.id);
    expect((decoded as { invitorId: string; teamId: string }).teamId).toEqual(
      user.teamId.toString(),
    );
  });
});
