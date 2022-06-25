import {
  QueryClient,
  QueryFunction,
  QueryKey,
  UseQueryOptions
} from 'vue-query';
import { RouteLocationNormalized } from 'vue-router';
import { ILoader } from '../types';
import { QueryPreloader } from './query-preloader.model';
import { QueryLoader } from './query.loader.model';

export type RouteQueryMapFn<T> = (nextRoute: RouteLocationNormalized) => Omit<
  UseQueryOptions,
  'queryFn' | 'queryKey'
> & {
  queryKey: QueryKeyFunction;
  queryFn: ExtendedQueryFn<T>;
  ssrPrefetch?: boolean;
  waitUntilPreloaded?: boolean;
  dependsOn?: string[];
};

export type QueriesOptions<T> = {
  [Property in keyof T]: RouteQueryMapFn<T[Property]>;
};

export type LoaderOptions<T> = {
  name: string;
  queryClient: QueryClient;
  queriesOptions: QueriesOptions<T>;
};

type QueryKeyFunction = (deps: any) => QueryKey;
type ExtendedQueryFn<T> = (ctx: any, deps: any) => ReturnType<QueryFunction<T>>;

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
