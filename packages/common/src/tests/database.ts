import mongoose from 'mongoose';

export const connectDatabase = async () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const uri = global.__MONGO_URI__;

  mongoose.connect(uri);
};

export const closeDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
};

export const clearDatabase = async () => {
  const { collections } = mongoose.connection;

  Object.keys(collections).forEach(async (connection) => {
    await mongoose.connection.db.dropCollection(connection);
  });
};
