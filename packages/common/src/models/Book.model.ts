import mongoose, { Document, Model } from 'mongoose';

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: false,
    },
    page: {
      type: Number,
      required: false,
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
    collection: 'book',
  },
);

export interface IBook extends Document {
  _id: string;
  title: string;
  author?: string;
  page?: number;
}

export const BookModel: Model<IBook> = mongoose.model('Book', schema);
