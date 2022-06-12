import mongoose, { Schema, Document, Model } from 'mongoose';

const schema = new mongoose.Schema(
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

export interface Team extends Document {
  _id: string;
  name: string;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
}

export const TeamModel: Model<Team> = mongoose.model('Team', schema);
