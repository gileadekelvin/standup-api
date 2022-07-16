import { Request } from 'express';

export interface CustomRequest extends Request {
  auth: {
    user: any;
    error: string | null;
  };
}
