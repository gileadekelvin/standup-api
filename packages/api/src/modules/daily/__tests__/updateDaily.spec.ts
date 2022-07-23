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
  mutation updateDaily($input: UpdateDailyInput!) {
    updateDaily(input: $input) {
      Error
      Daily {
        _id
        id
        teamId
        author {
          name
          userId
        }
        blocks {
          text
          status {
            done
            updatedAt
          }
        }
        today {
          text
          status {
            done
            updatedAt
          }
        }
        yesterday {
          text
          status {
            done
            updatedAt
          }
        }
      }
    }
  }
`;

let user: User;
let daily: Daily;
let context: GraphQLContext;

describe('Test updateDaily', () => {
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

  test('should update a daily', async () => {
    const input = {
      input: {
        id: toGlobalId('Daily', daily.id),
        yesterday: [
          { text: Faker.lorem.sentences(), status: { done: false, updatedAt: new Date() } },
        ],
        blocks: [],
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

    expect(response?.data?.updateDaily).toBeDefined();
    expect(response?.data?.updateDaily.Error).toBeNull();

    expect(response?.data?.updateDaily?.Daily.yesterday).toHaveLength(1);
    expect(response?.data?.updateDaily?.Daily.yesterday[0]).toMatchObject(input.input.yesterday[0]);

    expect(response?.data?.updateDaily?.Daily.today).toHaveLength(2);
    expect(response?.data?.updateDaily?.Daily.today[0].text).toEqual(daily?.today?.[0]?.text);
    expect(response?.data?.updateDaily?.Daily.today[0].status.done).toEqual(
      daily?.today?.[0]?.status?.done,
    );
    expect(response?.data?.updateDaily?.Daily.today[0].status.updatedAt).toEqual(
      daily?.today?.[0]?.status?.updatedAt,
    );
    expect(response?.data?.updateDaily?.Daily.today[1].text).toEqual(daily?.today?.[1]?.text);
    expect(response?.data?.updateDaily?.Daily.today[1].status.done).toEqual(
      daily?.today?.[1]?.status?.done,
    );
    expect(response?.data?.updateDaily?.Daily.today[1].status.updatedAt).toEqual(
      daily?.today?.[1]?.status?.updatedAt,
    );

    expect(response?.data?.updateDaily?.Daily.blocks).toHaveLength(0);

    expect(response?.data?.updateDaily?.Daily.teamId).toEqual(user.teamId.toString());
    expect(response?.data?.updateDaily?.Daily.author.userId).toEqual(user._id.toString());
    expect(response?.data?.updateDaily?.Daily.author.name).toEqual(user.name);
  });

  test('should not validate mutation with invalid object id', async () => {
    const input = {
      input: {
        id: toGlobalId('Daily', Faker.datatype.uuid()),
        yesterday: [
          { text: Faker.lorem.sentences(), status: { done: false, updatedAt: new Date() } },
        ],
        blocks: [],
      },
    };

    const response = await graphql({
      schema,
      query,
      context,
      variables: input,
    });

    expect(response.data.updateDaily).toBeNull();
    expect(response.errors?.[0].message).toBe('Invalid Object ID');
  });

  test('should not validate mutation with other type id', async () => {
    const input = {
      input: {
        id: toGlobalId('Team', '62c63f65a19578a0ae6bc1d6'),
        yesterday: [
          { text: Faker.lorem.sentences(), status: { done: false, updatedAt: new Date() } },
        ],
        blocks: [],
      },
    };

    const response = await graphql({
      schema,
      query,
      context,
      variables: input,
    });

    expect(response.data.updateDaily).toBeNull();
    expect(response.errors).toHaveLength(1);
  });

  test('should return error if daily does not exist', async () => {
    const input = {
      input: {
        id: toGlobalId('Daily', '62c63f65a19578a0ae6bc1d6'),
        yesterday: [
          { text: Faker.lorem.sentences(), status: { done: false, updatedAt: new Date() } },
        ],
        blocks: [],
      },
    };

    const response = await graphql({
      schema,
      query,
      context,
      variables: input,
    });

    expect(response.data.updateDaily.Daily).toBeNull();
    expect(response.data.updateDaily.Error).toEqual(['Daily not found']);
  });

  test('should return error if daily belongs to another user', async () => {
    const input = {
      input: {
        id: toGlobalId('Daily', daily.id),
        yesterday: [
          { text: Faker.lorem.sentences(), status: { done: false, updatedAt: new Date() } },
        ],
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

    expect(response.data.updateDaily.Daily).toBeNull();
    expect(response.data.updateDaily.Error).toEqual(['User not allowed']);
  });
});
