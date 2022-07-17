import { DailyResolvers } from '../schema';

const Daily: DailyResolvers = {
  authorInfo: (_, __, ctx) => ctx.dataloaders.user.load(ctx.user.id),
};

export default {
  Daily,
};
