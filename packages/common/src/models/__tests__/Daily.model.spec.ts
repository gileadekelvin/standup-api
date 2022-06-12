import Faker from 'faker';

import { User } from '../User.model';
import { DailyModel } from '../Daily.model';
import { connectDatabase, closeDatabase } from '../../tests/database';
import { createUser } from '../../helpers/testUtils/createUser';

describe('Test DailyModel', () => {
  let user: User;

  beforeAll(async () => {
    await connectDatabase();
    const { user: userCreated } = await createUser();
    user = userCreated;
  });

  afterAll(async () => {
    await closeDatabase();
  });

  test('should create a daily register', async () => {
    const daily = await DailyModel.create({
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

    const dailyFromDb = await DailyModel.findById(daily._id);
    expect(dailyFromDb).toBeDefined();

    expect(daily.author.userId).toEqual(user._id);
    expect(daily.author.name).toEqual(user.name);

    const yesterday = dailyFromDb?.yesterday;
    expect(yesterday).toBeDefined();
    expect(yesterday).toHaveLength(2);
    expect(yesterday).not.toBeNull();
    if (!yesterday || !daily.yesterday) {
      throw Error('yesterday is null');
    }
    expect(yesterday[0].text).toBe(daily.yesterday[0].text);
    expect(yesterday[0].status?.done).toBe(daily.yesterday[0].status?.done);
    expect(yesterday[0].status?.updatedAt).toEqual(daily.yesterday[0].status?.updatedAt);

    const today = dailyFromDb?.today;
    expect(today).toBeDefined();
    expect(today).toHaveLength(2);
    if (!today || !daily.today) {
      throw Error('today is null');
    }
    expect(today[0].text).toBe(daily.today[0].text);
    expect(today[0].status?.done).toBe(daily.today[0].status?.done);
    expect(today[0].status?.updatedAt).toEqual(daily.today[0].status?.updatedAt);

    const blocks = dailyFromDb?.blocks;
    expect(blocks).toBeDefined();
    expect(blocks).toHaveLength(2);
    if (!blocks || !daily.blocks) {
      throw Error('blocks is null');
    }
    expect(blocks[0].text).toBe(daily.blocks[0].text);
    expect(blocks[0].status?.done).toBe(daily.blocks[0].status?.done);
    expect(blocks[0].status?.updatedAt).toEqual(daily.blocks[0].status?.updatedAt);
  });
});
