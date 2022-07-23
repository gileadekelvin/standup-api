import Faker from 'faker';
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
  mutation deleteDaily($input: DeleteDailyInput!) {
    deleteDaily(input: $input) {
      Error
      Daily {
        _id
      }
    }
  }
`;

let user: User;
let daily: Daily;
let context: GraphQLContext;

describe('Test deleteDaily', () => {
  beforeAll(async () => {
    await connectDatabase();
    user = (await createUser()).user;
    context = getTestContext(user);

    daily = await DailyModel.create({
      yesterday: [
        { text: Faker.lorem.sentences(), status: { done: false, updatedAt: new Date() } },
        { text: Faker.lorem.sentences(), status: { done: true, updatedAt: new Date() } },
      ],
      today: [
        { text: Faker.lorem.sentences(), status: { done: false, updatedAt: new Date() } },
        { text: Faker.lorem.sentences(), status: { done: true, updatedAt: new Date() } },
      ],
      blocks: [
        { text: Faker.lorem.sentences(), status: { done: false, updatedAt: new Date() } },
        { text: Faker.lorem.sentences(), status: { done: true, updatedAt: new Date() } },
      ],
      teamId: user.teamId,
      author: {
        userId: user._id,
        name: user.name,
      },
    });
  });

  afterAll(async () => {
    await closeDatabase();
  });

  it('should delete a daily', async () => {
    const input = {
      input: {
        id: toGlobalId('Daily', daily.id),
      },
    };

    const response = await graphql({
      schema,
      query,
      context,
      variables: input,
    });

    expect(response).toBeDefined();
    expect(response?.errors).toBeUndefined();

    expect(response?.data?.deleteDaily).toBeDefined();
    expect(response?.data?.deleteDaily.Error).toBeNull();
    expect(response?.data?.deleteDaily.Daily._id).toEqual(daily.id);
  });

  it('should not validate mutation with invalid object id', async () => {
    const input = {
      input: {
        id: toGlobalId('Daily', Faker.datatype.uuid()),
      },
    };

    const response = await graphql({
      schema,
      query,
      context,
      variables: input,
    });

    expect(response.data.deleteDaily).toBeNull();
    expect(response.errors?.[0].message).toBe('Invalid Object ID');
  });

  it('should not validate mutation with other type id', async () => {
    const input = {
      input: {
        id: toGlobalId('Team', '62c63f65a19578a0ae6bc1d6'),
      },
    };

    const response = await graphql({
      schema,
      query,
      context,
      variables: input,
    });

    expect(response.data.deleteDaily).toBeNull();
    expect(response.errors).toHaveLength(1);
  });

  it('should return error if daily does not exist', async () => {
    const input = {
      input: {
        id: toGlobalId('Daily', '62c63f65a19578a0ae6bc1d6'),
      },
    };

    const response = await graphql({
      schema,
      query,
      context,
      variables: input,
    });

    expect(response.data.deleteDaily.Daily).toBeNull();
    expect(response.data.deleteDaily.Error).toEqual(['Daily not found']);
  });

  it('should return error if daily belongs to another user', async () => {
    const newDaily = await DailyModel.create({
      yesterday: [
        { text: Faker.lorem.sentences(), status: { done: false, updatedAt: new Date() } },
        { text: Faker.lorem.sentences(), status: { done: true, updatedAt: new Date() } },
      ],
      today: [
        { text: Faker.lorem.sentences(), status: { done: false, updatedAt: new Date() } },
        { text: Faker.lorem.sentences(), status: { done: true, updatedAt: new Date() } },
      ],
      blocks: [
        { text: Faker.lorem.sentences(), status: { done: false, updatedAt: new Date() } },
        { text: Faker.lorem.sentences(), status: { done: true, updatedAt: new Date() } },
      ],
      teamId: user.teamId,
      author: {
        userId: user._id,
        name: user.name,
      },
    });

    const input = {
      input: {
        id: toGlobalId('Daily', newDaily.id),
      },
    };

    const newUser = (await createUser()).user;
    const newUserContext = getTestContext(newUser);

    const response = await graphql({
      schema,
      query,
      context: newUserContext,
      variables: input,
    });

    expect(response.data.deleteDaily.Daily).toBeNull();
    expect(response.data.deleteDaily.Error).toEqual(['User not allowed']);
  });
});
