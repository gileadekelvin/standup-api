/* eslint-disable no-console */
import { connect, set } from 'mongoose';

import { MONGOURI, MONGO_DATABASE, MONGO_LOG } from '../config';

export const connectDB = async () => {
  try {
    await connect(MONGOURI as string, { dbName: MONGO_DATABASE });

    if (MONGO_LOG === 'debug') {
      set('debug', (collectionName, method, query, doc) => {
        console.log(`${collectionName}.${method}`, JSON.stringify(query), doc);
      });
    }

    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};
