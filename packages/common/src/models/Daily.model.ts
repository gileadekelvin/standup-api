import mongoose, { Schema, Document, Model } from 'mongoose';

export type Maybe<T> = T | null;

type task = {
  text: string;
  status?: {
    done?: boolean | null | undefined;
    updatedAt?: Date;
  } | null;
};

export interface DailyI {
  _id: string;
  yesterday?: Maybe<task>[] | null | undefined;
  today?: Maybe<task>[] | null | undefined;
  blocks?: Maybe<task>[] | null | undefined;
  teamId: Schema.Types.ObjectId | string;
  author: { userId: Schema.Types.ObjectId | string; name: string };
  createdAt: Date;
  updatedAt: Date;
}

export interface Daily extends Document, DailyI {
  _id: string;
}

const TaskSchema = new mongoose.Schema({
  text: { type: Schema.Types.String, required: true },
  status: { type: { done: Schema.Types.Boolean, updatedAt: Schema.Types.Date }, required: false },
});

const DailySchema = new mongoose.Schema<Daily>(
  {
    yesterday: {
      type: [TaskSchema],
    },
    today: {
      type: [TaskSchema],
    },
    blocks: {
      type: [TaskSchema],
    },
    teamId: {
      type: Schema.Types.ObjectId,
      ref: 'Team',
      required: true,
      index: true,
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

DailySchema.index({ createdAt: -1 });

export const DailyModel: Model<Daily> = mongoose.model('Daily', DailySchema);
