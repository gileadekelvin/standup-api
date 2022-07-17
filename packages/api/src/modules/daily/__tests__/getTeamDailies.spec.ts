import Faker from 'faker';
import { graphql, print } from 'graphql';
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
import { schema, getTestContext } from '../../../tests/utils';

const query = gql`
  query getUser {
    me {
      id
      team {
        dailies {
          _id
          id
          teamId
          authorInfo {
            _id
          }
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
  }
`;

let user: User;
let dailies: Daily[];
let context: GraphQLContext;

const createDailies = async (author: User) => {
  const promiseDailies: Promise<Daily>[] = [0, 1].map(() => {
    return DailyModel.create({
      yesterday: [],
      today: [{ text: Faker.lorem.sentences(), status: { done: false, updatedAt: new Date() } }],
      blocks: [
        { text: Faker.lorem.sentences(), status: { done: false, updatedAt: new Date() } },
        { text: Faker.lorem.sentences(), status: { done: true, updatedAt: new Date() } },
      ],
      teamId: author.teamId,
      author: {
        userId: author._id,
        name: author.name,
      },
    });
  });
  const createdDailies = await Promise.all(promiseDailies);
  return createdDailies;
};

describe('Test get team dailies', () => {
  beforeAll(async () => {
    await connectDatabase();

    const userInfo = await createUser();
    user = userInfo.user;

    dailies = await createDailies(user);

    context = getTestContext(user);
  });

  afterAll(async () => {
    await closeDatabase();
  });

  test('should return list of dailies', async () => {
    const response = (await graphql({
      schema,
      source: print(query),
      contextValue: context,
    })) as any;

    expect(response).toBeDefined();
    expect(response?.errors).toBeUndefined();

    expect(response?.data?.me.id).toEqual(toGlobalId('User', user.id));

    const firstDaily = response?.data?.me.team.dailies[0];

    expect(firstDaily._id).toEqual(dailies[0]._id.toString());
    expect(firstDaily.id).toEqual(toGlobalId('Daily', dailies[0].id));
    expect(firstDaily.teamId).toEqual(dailies[0].teamId.toString());
    expect(firstDaily.authorInfo._id).toEqual(user._id.toString());
    expect(firstDaily.author.userId).toEqual(dailies[0].author.userId.toString());
    expect(firstDaily.author.name).toEqual(dailies[0].author.name);

    expect(firstDaily.blocks[0].text).toEqual(dailies[0].blocks?.[0].text);
    expect(firstDaily.blocks[0].status.done).toEqual(dailies[0].blocks?.[0].status?.done);
    expect(firstDaily.blocks[0].status.updatedAt).toEqual(dailies[0].blocks?.[0].status?.updatedAt);
    expect(firstDaily.blocks[1].text).toEqual(dailies[0].blocks?.[1].text);
    expect(firstDaily.blocks[1].status.done).toEqual(dailies[0].blocks?.[1].status?.done);
    expect(firstDaily.blocks[1].status.updatedAt).toEqual(dailies[0].blocks?.[1].status?.updatedAt);

    expect(firstDaily.today[0].text).toEqual(dailies[0].today?.[0].text);
    expect(firstDaily.today[0].status.done).toEqual(dailies[0].today?.[0].status?.done);
    expect(firstDaily.today[0].status.updatedAt).toEqual(dailies[0].today?.[0].status?.updatedAt);

    expect(firstDaily.yesterday).toHaveLength(0);

    const secondDaily = response?.data?.me.team.dailies[1];

    expect(secondDaily._id).toEqual(dailies[1]._id.toString());
    expect(secondDaily.id).toEqual(toGlobalId('Daily', dailies[1].id));
    expect(secondDaily.teamId).toEqual(dailies[1].teamId.toString());
    expect(secondDaily.authorInfo._id).toEqual(user._id.toString());
    expect(secondDaily.author.userId).toEqual(dailies[1].author.userId.toString());
    expect(secondDaily.author.name).toEqual(dailies[1].author.name);

    expect(secondDaily.blocks[0].text).toEqual(dailies[1].blocks?.[0].text);
    expect(secondDaily.blocks[0].status.done).toEqual(dailies[1].blocks?.[0].status?.done);
    expect(secondDaily.blocks[0].status.updatedAt).toEqual(
      dailies[1].blocks?.[0].status?.updatedAt,
    );
    expect(secondDaily.blocks[1].text).toEqual(dailies[1].blocks?.[1].text);
    expect(secondDaily.blocks[1].status.done).toEqual(dailies[1].blocks?.[1].status?.done);
    expect(secondDaily.blocks[1].status.updatedAt).toEqual(
      dailies[1].blocks?.[1].status?.updatedAt,
    );

    expect(secondDaily.today[0].text).toEqual(dailies[1].today?.[0].text);
    expect(secondDaily.today[0].status.done).toEqual(dailies[1].today?.[0].status?.done);
    expect(secondDaily.today[0].status.updatedAt).toEqual(dailies[1].today?.[0].status?.updatedAt);

    expect(secondDaily.yesterday).toHaveLength(0);
  });
});