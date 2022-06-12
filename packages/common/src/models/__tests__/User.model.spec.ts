import Faker from 'faker';

import { CompanyModel } from '../Company.model';
import { TeamModel } from '../Team.model';
import { UserModel } from '../User.model';
import { connectDatabase, closeDatabase } from '../../tests/database';

describe('Test UserModel', () => {
  beforeAll(async () => {
    await connectDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  test('should create an user', async () => {
    const company = await CompanyModel.create({ name: Faker.name.title() });
    const team = await TeamModel.create({ name: Faker.name.title(), companyId: company._id });

    const user = await UserModel.create({
      name: Faker.name.title(),
      email: Faker.internet.email(),
      bio: Faker.lorem.paragraph(),
      role: { name: 'admin', level: 'organization' },
      teamId: team._id,
    });

    const userFromDb = await UserModel.findById(user._id);

    expect(user.teamId).toBe(team._id);
    expect(team.companyId).toBe(company._id);

    expect(userFromDb).toBeDefined();
    expect(userFromDb?.name).toBe(user.name);
    expect(userFromDb?.bio).toBe(user.bio);
    expect(userFromDb?.email).toBe(user.email);

    expect(userFromDb?.role.name).toBe(user.role.name);
    expect(userFromDb?.role.level).toBe(user.role.level);
    expect(userFromDb?.verified).toBeUndefined();
  });
});
