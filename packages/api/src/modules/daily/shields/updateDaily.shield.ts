import { inputRule } from 'graphql-shield';

import { MutationUpdateDailyArgs } from '../../schema';
import { getNodeValidator } from '../../../validators/getNodeValidator';

import { validateTask } from './createDaily.shield';

const updateDailyValidator = inputRule<MutationUpdateDailyArgs>('updateDailyValidator')((yup) =>
  yup
    .object({
      input: yup
        .object({
          id: getNodeValidator(['Daily']).required(),
          today: validateTask(),
          yesterday: validateTask(),
          blocks: validateTask(),
        })
        .required(),
    })
    .required(),
);

const updateDailyShield = {
  Mutation: {
    updateDaily: updateDailyValidator,
  },
};

export default updateDailyShield;
