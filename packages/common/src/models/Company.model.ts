import mongoose, { Schema, Document, Model } from 'mongoose';

export interface Company extends Document {
  _id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new mongoose.Schema<Company>(
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

export const CompanyModel: Model<Company> = mongoose.model('Company', schema);
