import { QueryClient } from 'vue-query';
import { Loader, RouteQueryMapFn } from '../models/loader.model';

export const createLoader = (
  name: string,
  queriesOptions: Record<string, RouteQueryMapFn>
) => {
  return (queryClient: QueryClient): Loader => {
    return new Loader({ name, queriesOptions, queryClient });
  };
};
