import DataLoader from 'dataloader';
import { Document, Model } from 'mongoose';
import { get, keyBy } from 'lodash';

export function createSimpleDataLoader<Doc extends Document>(model: Model<Doc>) {
  const loader = new DataLoader(async (ids: readonly string[]) => {
    const results = await model.find({ _id: { $in: ids } });
    const docMap = keyBy(results, '_id');
    return ids.map((id) => get(docMap, id as string, null));
  });

  return loader;
}
