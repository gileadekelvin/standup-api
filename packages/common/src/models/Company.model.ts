import mongoose, { Schema, Document, Model } from 'mongoose';

const schema = new mongoose.Schema(
  {
    name: {
      type: Schema.Types.String,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
    collection: 'company',
  },
);

export interface Company extends Document {
  _id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export const CompanyModel: Model<Company> = mongoose.model('Company', schema);
