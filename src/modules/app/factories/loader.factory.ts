import { QueryClient } from 'vue-query';
import { Loader, QueriesOptions } from '../models/loader.model';

export const createLoader = <T = Record<string, any>>(
  name: string,
  queriesOptions: QueriesOptions<T>
) => {
  return (queryClient: QueryClient): Loader<T> => {
    return new Loader<T>({ name, queriesOptions, queryClient });
  };
};
