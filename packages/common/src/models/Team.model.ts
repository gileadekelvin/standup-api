import mongoose, { Schema, Document, Model } from 'mongoose';

export interface Team extends Document {
  _id: string;
  name: string;
  companyId: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new mongoose.Schema<Team>(
  {
    name: {
      type: Schema.Types.String,
      required: true,
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: false,
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
    collection: 'team',
  },
);

export const TeamModel: Model<Team> = mongoose.model('Team', schema);
