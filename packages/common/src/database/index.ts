import { connect } from 'mongoose';

import { MONGOURI } from '../config';

export const connectDB = async () => {
  try {
    await connect(MONGOURI as string, { dbName: 'api' });
    // eslint-disable-next-line no-console
    console.log('MongoDB Connected...');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};
