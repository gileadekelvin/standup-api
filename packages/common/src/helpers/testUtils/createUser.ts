// eslint-disable-next-line import/no-extraneous-dependencies
import Faker from 'faker';

import { CompanyModel, Company } from '../../models/Company.model';
import { TeamModel, Team } from '../../models/Team.model';
import { UserModel, User } from '../../models/User.model';

export const createUser = async (args?: {
  userPayload?: Partial<User>;
  teamPayload?: Partial<Team>;
  companyPayload?: Partial<Company>;
}) => {
  const company = await CompanyModel.create({ name: Faker.name.title(), ...args?.companyPayload });

  const team = await TeamModel.create({
    name: Faker.name.title(),
    companyId: company?._id,
    ...args?.teamPayload,
  });

  const user = await UserModel.create({
    name: Faker.name.title(),
    email: Faker.internet.email(),
    bio: Faker.lorem.paragraph(),
    role: { name: 'ADMIN', level: 'ORGANIZATION' },
    teamId: team._id,
    googleId: Faker.datatype.uuid(),
    ...args?.userPayload,
  });

  return { user, team, company };
};
