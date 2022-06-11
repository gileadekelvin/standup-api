/* eslint-disable no-console */
import { connect } from 'mongoose';

import { MONGOURI, MONGO_DATABASE } from '../config';

export const connectDB = async () => {
  try {
    await connect(MONGOURI as string, { dbName: MONGO_DATABASE });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};
