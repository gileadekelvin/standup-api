import mongoose, { Schema, Document, Model } from 'mongoose';

export interface TeamChangeLog extends Document {
  _id: string;
  userId: Schema.Types.ObjectId;
  oldTeamId: Schema.Types.ObjectId;
  newTeamId: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new mongoose.Schema<TeamChangeLog>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    oldTeamId: {
      type: Schema.Types.ObjectId,
      ref: 'Team',
      required: true,
    },
    newTeamId: {
      type: Schema.Types.ObjectId,
      ref: 'Team',
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
    collection: 'teamChangeLog',
  },
);

export const TeamChangeLogModel: Model<TeamChangeLog> = mongoose.model('TeamChangeLog', schema);
