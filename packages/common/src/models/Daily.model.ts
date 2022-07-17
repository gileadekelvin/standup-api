import mongoose, { Schema, Document, Model } from 'mongoose';

type task = {
  text: string;
  status?: {
    done: boolean;
    updatedAt: Date;
  };
};

export interface Daily extends Document {
  _id: string;
  yesterday: task[] | null;
  today: task[] | null;
  blocks: task[] | null;
  teamId: Schema.Types.ObjectId;
  author: { userId: Schema.Types.ObjectId; name: string };
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new mongoose.Schema({
  text: { type: Schema.Types.String, required: true },
  status: { type: { done: Schema.Types.Boolean, updatedAt: Schema.Types.Date }, required: false },
});

const DailySchema = new mongoose.Schema<Daily>(
  {
    yesterday: {
      type: [TaskSchema],
      required: true,
    },
    today: {
      type: [TaskSchema],
      required: true,
    },
    blocks: {
      type: [TaskSchema],
      required: true,
    },
    teamId: {
      type: Schema.Types.ObjectId,
      ref: 'Team',
      required: true,
    },
    author: {
      type: {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        name: { type: Schema.Types.String, required: true },
      },
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
    collection: 'daily',
  },
);

export const DailyModel: Model<Daily> = mongoose.model('Daily', DailySchema);
