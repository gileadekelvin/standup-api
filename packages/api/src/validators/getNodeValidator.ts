import { fromGlobalId } from 'graphql-relay';
import { StringSchema, string } from 'yup';

const parseGlobalRelayId = (validTypes: string[], value: string) => {
  const { id, type } = fromGlobalId(value);
  if (!validTypes.includes(type)) {
    return new Error(`Invalid type: ${type}. Expected one of ${validTypes.join(', ')}`);
  }
  return id;
};

export const getNodeValidator = (validTypes: string[]) => {
  return string()
    .transform((node) => {
      return parseGlobalRelayId(validTypes, node);
    })
    .test('test-string', 'Invalid ID', (id) => {
      return !!id;
    }) as StringSchema;
};
