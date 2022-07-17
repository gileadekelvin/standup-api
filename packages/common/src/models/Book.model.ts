import mongoose, { Document, Model } from 'mongoose';

export interface IBook extends Document {
  _id: string;
  title: string;
  author?: string;
  page?: number;
  creatorId?: string;
}

const schema = new mongoose.Schema<IBook>(
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
    creatorId: {
      type: String,
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

export const BookModel: Model<IBook> = mongoose.model('Book', schema);
