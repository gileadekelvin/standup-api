// eslint-disable-next-line import/no-extraneous-dependencies
import Faker from 'faker';

import { CompanyModel, Company } from '../../models/Company.model';
import { TeamModel, Team } from '../../models/Team.model';
import { UserModel, User } from '../../models/User.model';

export const createUser = async (
  userPayload?: User,
  teamPayload?: Team,
  companyPayload?: Company,
) => {
  const company = await CompanyModel.create({ name: Faker.name.title(), ...companyPayload });

  const team = await TeamModel.create({
    name: Faker.name.title(),
    companyId: company?._id,
    ...teamPayload,
  });

  const user = await UserModel.create({
    name: Faker.name.title(),
    email: Faker.internet.email(),
    bio: Faker.lorem.paragraph(),
    role: { name: 'admin', level: 'organization' },
    teamId: team._id,
    ...userPayload,
  });

  return { user, team, company };
};
