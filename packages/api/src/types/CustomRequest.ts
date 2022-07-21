import { User } from '@standup/common';
import { Request } from 'express';

export interface CustomRequest extends Request {
  auth: {
    user: User | null | undefined;
    error: string | null | undefined;
  };
}
