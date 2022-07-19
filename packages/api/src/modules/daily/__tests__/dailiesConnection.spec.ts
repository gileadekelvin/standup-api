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
import { TeamDailiesArgs } from '../../schema';
import { offsetToCursor } from '../../../helpers/cursor';

const query = gql`
  query getDailies($first: Int!, $after: String) {
    me {
      id
      team {
        dailies(first: $first, after: $after) {
          totalCount
          pageInfo {
            startCursor
            endCursor
            hasNextPage
            hasPreviousPage
          }
          edges {
            cursor
            node {
              _id
              id
            }
          }
        }
      }
    }
  }
`;

let mary: User;
let john: User;
let dailiesMary: Daily[];
let dailiesPeter: Daily[];
let contextMary: GraphQLContext;
let contextJohn: GraphQLContext;

const createDailies = async (author: User) => {
  const promiseDailies: Promise<Daily>[] = [0, 1, 2, 3, 4].map(() => {
    return DailyModel.create({
      yesterday: [],
      today: [],
      blocks: [],
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
    mary = userInfo.user;

    dailiesMary = await createDailies(mary);
    contextMary = getTestContext(mary);

    const userInfoJohn = await createUser();
    john = userInfoJohn.user;
    contextJohn = getTestContext(john);
    await createDailies(john);

    const userInfoPeter = await createUser({
      userPayload: {
        teamId: mary.teamId,
      },
    });
    const peter = userInfoPeter.user;
    dailiesPeter = await createDailies(peter);
  });

  afterAll(async () => {
    await closeDatabase();
  });

  it('should return list of dailies', async () => {
    const input: TeamDailiesArgs = {
      first: 2,
    };
    const response = (await graphql({
      schema,
      source: print(query),
      contextValue: contextMary,
      variableValues: input,
    })) as any;

    expect(response).toBeDefined();
    expect(response?.errors).toBeUndefined();

    expect(response?.data?.me.id).toEqual(toGlobalId('User', mary.id));

    expect(response?.data?.me.team.dailies.edges).toHaveLength(2);
    expect(response?.data?.me.team.dailies.totalCount).toBe(10);
    expect(response?.data?.me.team.dailies.pageInfo.startCursor).toEqual(
      offsetToCursor(dailiesPeter[4].createdAt, dailiesPeter[4]._id.toString()),
    );
    expect(response?.data?.me.team.dailies.pageInfo.endCursor).toEqual(
      offsetToCursor(dailiesPeter[3].createdAt, dailiesPeter[3]._id.toString()),
    );
    expect(response?.data?.me.team.dailies.pageInfo.hasNextPage).toBeTruthy();
    expect(response?.data?.me.team.dailies.pageInfo.hasPreviousPage).toBeFalsy();

    const firstDaily = response?.data?.me.team.dailies.edges[0].node;
    expect(firstDaily._id).toEqual(dailiesPeter[4]._id.toString());
    expect(firstDaily.id).toEqual(toGlobalId('Daily', dailiesPeter[4].id));

    const secondDaily = response?.data?.me.team.dailies.edges[1].node;
    expect(secondDaily._id).toEqual(dailiesPeter[3]._id.toString());
    expect(secondDaily.id).toEqual(toGlobalId('Daily', dailiesPeter[3].id));
  });

  it('should return list of dailies after cursor', async () => {
    const input: TeamDailiesArgs = {
      first: 2,
      after: offsetToCursor(dailiesPeter[3].createdAt, dailiesPeter[3]._id.toString()),
    };
    const response = (await graphql({
      schema,
      source: print(query),
      contextValue: contextMary,
      variableValues: input,
    })) as any;

    expect(response).toBeDefined();
    expect(response?.errors).toBeUndefined();

    expect(response?.data?.me.id).toEqual(toGlobalId('User', mary.id));

    expect(response?.data?.me.team.dailies.edges).toHaveLength(2);
    expect(response?.data?.me.team.dailies.totalCount).toBe(10);
    expect(response?.data?.me.team.dailies.pageInfo.startCursor).toEqual(
      offsetToCursor(dailiesPeter[2].createdAt, dailiesPeter[2]._id.toString()),
    );
    expect(response?.data?.me.team.dailies.pageInfo.endCursor).toEqual(
      offsetToCursor(dailiesPeter[1].createdAt, dailiesPeter[1]._id.toString()),
    );
    expect(response?.data?.me.team.dailies.pageInfo.hasNextPage).toBeTruthy();
    expect(response?.data?.me.team.dailies.pageInfo.hasPreviousPage).toBeFalsy();

    const firstDaily = response?.data?.me.team.dailies.edges[0].node;
    expect(firstDaily._id).toEqual(dailiesPeter[2]._id.toString());
    expect(firstDaily.id).toEqual(toGlobalId('Daily', dailiesPeter[2].id));

    const secondDaily = response?.data?.me.team.dailies.edges[1].node;
    expect(secondDaily._id).toEqual(dailiesPeter[1]._id.toString());
    expect(secondDaily.id).toEqual(toGlobalId('Daily', dailiesPeter[1].id));
  });

  it('should return final elements of the list of dailies after cursor', async () => {
    const input: TeamDailiesArgs = {
      first: 3,
      after: offsetToCursor(dailiesMary[1].createdAt, dailiesMary[1]._id.toString()),
    };
    const response = (await graphql({
      schema,
      source: print(query),
      contextValue: contextMary,
      variableValues: input,
    })) as any;

    expect(response).toBeDefined();
    expect(response?.errors).toBeUndefined();

    expect(response?.data?.me.id).toEqual(toGlobalId('User', mary.id));

    expect(response?.data?.me.team.dailies.edges).toHaveLength(1);
    expect(response?.data?.me.team.dailies.totalCount).toBe(10);
    expect(response?.data?.me.team.dailies.pageInfo.startCursor).toEqual(
      offsetToCursor(dailiesMary[0].createdAt, dailiesMary[0]._id.toString()),
    );
    expect(response?.data?.me.team.dailies.pageInfo.endCursor).toEqual(
      offsetToCursor(dailiesMary[0].createdAt, dailiesMary[0]._id.toString()),
    );
    expect(response?.data?.me.team.dailies.pageInfo.hasNextPage).toBeFalsy();
    expect(response?.data?.me.team.dailies.pageInfo.hasPreviousPage).toBeFalsy();

    const firstDaily = response?.data?.me.team.dailies.edges[0].node;
    expect(firstDaily._id).toEqual(dailiesMary[0]._id.toString());
    expect(firstDaily.id).toEqual(toGlobalId('Daily', dailiesMary[0].id));
  });

  it('should return empty with first 0', async () => {
    const input: TeamDailiesArgs = {
      first: 0,
    };
    const response = (await graphql({
      schema,
      source: print(query),
      contextValue: contextMary,
      variableValues: input,
    })) as any;

    expect(response).toBeDefined();
    expect(response?.errors).toBeUndefined();

    expect(response?.data?.me.id).toEqual(toGlobalId('User', mary.id));

    expect(response?.data?.me.team.dailies.edges).toHaveLength(0);
    expect(response?.data?.me.team.dailies.totalCount).toBe(10);
    expect(response?.data?.me.team.dailies.pageInfo.startCursor).toBeNull();
    expect(response?.data?.me.team.dailies.pageInfo.endCursor).toBeNull();
    expect(response?.data?.me.team.dailies.pageInfo.hasNextPage).toBeFalsy();
    expect(response?.data?.me.team.dailies.pageInfo.hasPreviousPage).toBeFalsy();
  });

  it('should return empty response when after cursor is invalid', async () => {
    const input: TeamDailiesArgs = {
      first: 0,
      after: 'invalid',
    };
    const response = (await graphql({
      schema,
      source: print(query),
      contextValue: contextMary,
      variableValues: input,
    })) as any;

    expect(response).toBeDefined();
    expect(response?.errors).toBeUndefined();

    expect(response?.data?.me.id).toEqual(toGlobalId('User', mary.id));

    expect(response?.data?.me.team.dailies.edges).toHaveLength(0);
    expect(response?.data?.me.team.dailies.totalCount).toBe(0);
    expect(response?.data?.me.team.dailies.pageInfo.startCursor).toBeNull();
    expect(response?.data?.me.team.dailies.pageInfo.endCursor).toBeNull();
    expect(response?.data?.me.team.dailies.pageInfo.hasNextPage).toBeFalsy();
    expect(response?.data?.me.team.dailies.pageInfo.hasPreviousPage).toBeFalsy();
  });

  it('should return list of dailies from another user (different team)', async () => {
    const input: TeamDailiesArgs = {
      first: 5,
    };
    const response = (await graphql({
      schema,
      source: print(query),
      contextValue: contextJohn,
      variableValues: input,
    })) as any;

    expect(response).toBeDefined();
    expect(response?.errors).toBeUndefined();

    expect(response?.data?.me.id).toEqual(toGlobalId('User', john.id));

    expect(response?.data?.me.team.dailies.edges).toHaveLength(5);
    expect(response?.data?.me.team.dailies.totalCount).toBe(5);
  });
});
