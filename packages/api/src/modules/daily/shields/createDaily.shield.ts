import { boolean, object, string, array, date } from 'yup';
import { inputRule } from 'graphql-shield';

import { MutationCreateDailyArgs } from '../../schema';

const validateTask = () =>
  array(
    object({
      text: string().required(),
      status: object({
        done: boolean(),
        updatedAt: date(),
      }),
    }).required(),
  );

const createDailyValidator = inputRule<MutationCreateDailyArgs>('createDailyVaclidator')(
  (yup) =>
    yup
      .object({
        input: yup
          .object({
            today: validateTask(),
            yesterday: validateTask(),
            blocks: validateTask(),
          })
          .required(),
      })
      .required(),
  { strict: true },
);

const createDailyShield = {
  Mutation: {
    createDaily: createDailyValidator,
  },
};

export default createDailyShield;
