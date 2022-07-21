import Faker from 'faker';
import { graphql, ExecutionResult, print } from 'graphql';
import { gql } from 'graphql-tag';

import { createUser, User, connectDatabase, closeDatabase } from '@standup/common';

import { GraphQLContext } from '../../../types/GraphQLContext';
import { schema, getTestContext } from '../../../tests/utils';

const query = gql`
  mutation createDaily($input: CreateDailyInput!) {
    createDaily(input: $input) {
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
let context: GraphQLContext;

describe('Test createDaily', () => {
  beforeAll(async () => {
    await connectDatabase();
    user = (await createUser()).user;
    context = getTestContext(user);
  });

  afterAll(async () => {
    await closeDatabase();
  });

  test('should create a daily', async () => {
    const input = {
      input: {
        yesterday: [
          { text: Faker.lorem.sentences(), status: { done: false, updatedAt: new Date() } },
          { text: Faker.lorem.sentences(), status: { done: true, updatedAt: new Date() } },
        ],
        today: [{ text: Faker.lorem.sentences() }],
        blocks: [],
      },
    };

    const response = (await graphql({
      schema,
      source: print(query),
      variableValues: input,
      contextValue: context,
    })) as ExecutionResult<{ createDaily: any }>;

    expect(response).toBeDefined();
    expect(response?.errors).toBeUndefined();

    expect(response?.data?.createDaily).toBeDefined();
    expect(response?.data?.createDaily.Error).toBeNull();

    expect(response?.data?.createDaily?.Daily.yesterday).toHaveLength(2);
    expect(response?.data?.createDaily?.Daily.yesterday[0]).toMatchObject(input.input.yesterday[0]);
    expect(response?.data?.createDaily?.Daily.yesterday[1]).toMatchObject(input.input.yesterday[1]);

    expect(response?.data?.createDaily?.Daily.today).toHaveLength(1);
    expect(response?.data?.createDaily?.Daily.today[0]).toMatchObject(input.input.today[0]);
    expect(response?.data?.createDaily?.Daily.blocks).toHaveLength(0);

    expect(response?.data?.createDaily?.Daily.teamId).toEqual(user.teamId.toString());
    expect(response?.data?.createDaily?.Daily.author.userId).toEqual(user._id.toString());
    expect(response?.data?.createDaily?.Daily.author.name).toEqual(user.name);
  });
});
