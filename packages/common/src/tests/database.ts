import mongoose from 'mongoose';

export const connectDatabase = async () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const uri = global.__MONGO_URI__;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const dbName = global.__MONGO_DB_NAME__;

  await mongoose.connect(uri, { dbName });
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
