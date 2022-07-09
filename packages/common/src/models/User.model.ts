import mongoose, { Schema, Document, Model } from 'mongoose';

const schema = new mongoose.Schema(
  {
    name: {
      type: Schema.Types.String,
      required: true,
    },
    email: {
      type: Schema.Types.String,
      required: true,
    },
    verified: {
      type: Schema.Types.Boolean,
      required: false,
    },
    bio: {
      type: Schema.Types.String,
      required: false,
    },
    role: {
      type: { name: Schema.Types.String, level: Schema.Types.String },
      required: true,
    },
    teamId: {
      type: Schema.Types.ObjectId,
      ref: 'Team',
      required: true,
    },
    googleId: {
      type: Schema.Types.String,
      required: true,
      index: true,
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
    collection: 'user',
  },
);

export interface User extends Document {
  _id: string;
  name: string;
  email: string;
  verified?: boolean;
  bio?: string;
  role: {
    name: string;
    level: string;
  };
  teamId: string;
  createdAt: Date;
  updatedAt: Date;
}

export const UserModel: Model<User> = mongoose.model('User', schema);
