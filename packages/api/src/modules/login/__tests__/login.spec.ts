import Faker from 'faker';
import { graphql, ExecutionResult, GraphQLSchema, print } from 'graphql';
import { gql } from 'graphql-tag';
import {
  connectDatabase,
  closeDatabase,
  CompanyModel,
  TeamModel,
  UserModel,
} from '@standup/common';

import { buildCompleteSchema } from '../../../buildSchema';
import { MutationLoginArgs, LoginPayload } from '../../schema';
import { verifyJwtUser } from '../../../auth';

const query = gql`
  mutation login($token: String!) {
    login(token: $token) {
      token
    }
  }
`;

let schema: GraphQLSchema;

describe('Test login', () => {
  beforeAll(async () => {
    schema = buildCompleteSchema();
    await connectDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  test('should login user and create models', async () => {
    const input: MutationLoginArgs = { token: Faker.datatype.uuid() };

    const response = (await graphql({
      schema,
      source: print(query),
      variableValues: input,
    })) as ExecutionResult<{ login: LoginPayload }>;

    expect(response).toBeDefined();
    expect(response?.errors).toBeUndefined();

    const createdUser = await UserModel.findOne({ googleId: 'mockedGoogleId' });
    expect(createdUser).toBeDefined();
    expect(createdUser?.name).toBe('Test');
    expect(createdUser?.email).toBe('test@gmail.com');
    expect(createdUser?.verified).toBeTruthy();
    expect(createdUser?.role).toMatchObject({ name: 'admin', level: 'organization' });
    expect(createdUser?.teamId).toBeDefined();

    const createdTeam = await TeamModel.findById(createdUser?.teamId);
    expect(createdTeam).toBeDefined();
    expect(createdTeam?.name).toBe("Test's Team");
    expect(createdTeam?.companyId).toBeDefined();

    const createdCompany = await CompanyModel.findById(createdTeam?.companyId);
    expect(createdCompany).toBeDefined();
    expect(createdCompany?.name).toBe("Test's Company");

    expect(response?.data?.login.token).toBeDefined();
    const decodedToken = await verifyJwtUser(response?.data?.login.token as string);
    expect(decodedToken.userId).toEqual(createdUser?.id);
  });
});
