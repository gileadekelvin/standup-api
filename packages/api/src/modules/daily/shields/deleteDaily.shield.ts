import { inputRule } from 'graphql-shield';

import { MutationDeleteDailyArgs } from '../../schema';
import { getNodeValidator } from '../../../validators/getNodeValidator';

const deleteDailyValidator = inputRule<MutationDeleteDailyArgs>('deleteDailyValidator')((yup) =>
  yup
    .object({
      input: yup
        .object({
          id: getNodeValidator(['Daily']).required(),
        })
        .required(),
    })
    .required(),
);

const deleteDailyShield = {
  Mutation: {
    deleteDaily: deleteDailyValidator,
  },
};

export default deleteDailyShield;
