import {
  QueryClient,
  QueryFunction,
  QueryKey,
  UseQueryOptions
} from 'vue-query';
import { RouteLocationNormalized } from 'vue-router';
import { ILoader } from '@/types';
import { QueryPreloader } from './query-preloader.model';
import { QueryLoader } from './query.loader.model';

export type RouteQueryMapFn<TDeps, TData> = (
  nextRoute: RouteLocationNormalized
) => Omit<UseQueryOptions, 'queryFn' | 'queryKey'> & {
  queryKey: QueryKeyFunction<TDeps>;
  queryFn: ExtendedQueryFn<TDeps, TData>;
  ssrPrefetch?: boolean;
  waitUntilPreloaded?: boolean;
  dependsOn?: string[];
};

export type QueriesOptions<T> = {
  [Property in keyof T]: RouteQueryMapFn<T, T[Property]>;
};

export type LoaderOptions<T> = {
  name: string;
  queryClient: QueryClient;
  queriesOptions: QueriesOptions<T>;
};

type QueryKeyFunction<T> = (deps: T) => QueryKey;
type ExtendedQueryFn<TDeps, TData> = (
  ctx: any,
  deps: TDeps
) => ReturnType<QueryFunction<TData>>;

export class Loader<T> implements ILoader<T> {
  name: string;

  private queryLoader: QueryLoader<T>;

  private queryPreloader: QueryPreloader<T>;

  constructor({ name, queryClient, queriesOptions }: LoaderOptions<T>) {
    this.name = name;
    this.queryLoader = new QueryLoader({ name, queriesOptions });
    this.queryPreloader = new QueryPreloader({ queriesOptions, queryClient });
  }

  async preload(nextRoute: RouteLocationNormalized) {
    return this.queryPreloader.run(nextRoute);
  }

  getQueries() {
    return this.queryLoader.run();
  }
}
