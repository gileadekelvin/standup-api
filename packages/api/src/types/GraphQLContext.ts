import DataLoader from 'dataloader';
import { Types } from 'mongoose';

import { User, Team } from '@standup/common';

export type GraphQLContext = {
  user: User;
  auth: { error: string | null };
  dataloaders: {
    user: DataLoader<string, (User & { _id: Types.ObjectId }) | null, string>;
    team: DataLoader<string, (Team & { _id: Types.ObjectId }) | null, string>;
  };
};
