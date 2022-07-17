import DataLoader from 'dataloader';
import { Types } from 'mongoose';

import { User, Team, Daily } from '@standup/common';

export type GraphQLContext = {
  user: User;
  auth: { error: string | null };
  dataloaders: {
    User: DataLoader<string, (User & { _id: Types.ObjectId }) | null, string>;
    Team: DataLoader<string, (Team & { _id: Types.ObjectId }) | null, string>;
    Daily: DataLoader<string, (Daily & { _id: Types.ObjectId }) | null, string>;
  };
};
