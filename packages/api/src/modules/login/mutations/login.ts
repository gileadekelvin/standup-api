import jwt from 'jsonwebtoken';

import { API_SECRET } from '../../../config/index';
import { MutationLoginArgs } from '../../schema';

export const login = async (args: MutationLoginArgs) => {
  const token = jwt.sign({ status: 'oxe' }, API_SECRET as string, {
    algorithm: 'HS256',
    subject: args.name,
    expiresIn: '7d',
  });

  return { token };
};
