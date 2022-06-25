import { computed, onServerPrefetch, reactive, watch } from 'vue';
import {
  QueryClient,
  QueryFunction,
  QueryKey,
  useQuery,
  UseQueryOptions,
  UseQueryReturnType
} from 'vue-query';
import { RouteLocationNormalized, useRoute } from 'vue-router';
import { ILoader } from '../types';

export type RouteQueryMapFn = (nextRoute: RouteLocationNormalized) => Omit<
  UseQueryOptions,
  'queryFn' | 'queryKey'
> & {
  queryKey: (deps: any) => QueryKey;
  queryFn: ExtendedQueryFn;
  ssrPrefetch?: boolean;
  waitUntilPreloaded?: boolean;
  dependsOn?: string[];
};

type QueriesOptions = Record<string, RouteQueryMapFn>;

export type LoaderOptions = {
  name: string;
  queryClient: QueryClient;
  queriesOptions: QueriesOptions;
};

type ExtendedQueryFn = (ctx: any, deps: any) => ReturnType<QueryFunction>;
type ExtendedQuery = UseQueryReturnType<unknown, unknown> & {
  ssrPrefetch: boolean;
};

export class Loader implements ILoader {
  name: string;
  private queryClient: QueryClient;
  private queriesOptions: QueriesOptions;

  constructor({ name, queryClient, queriesOptions }: LoaderOptions) {
    this.name = name;
    this.queryClient = queryClient;
    this.queriesOptions = queriesOptions;
  }

  private sleep(duration: number) {
    return new Promise(res => {
      setTimeout(res, duration);
    });
  }

  async preload(nextRoute: RouteLocationNormalized) {
    const requiredPreloads: Promise<any>[] = [];
    const allPreloads: Record<string, Promise<any>> = {};
    Object.entries(this.queriesOptions).forEach(([key, queryDef]) => {
      const {
        queryKey,
        queryFn,
        staleTime,
        cacheTime,
        waitUntilPreloaded,
        dependsOn = []
      } = queryDef(nextRoute);
      const loadDependencies = async () => {
        await this.sleep(0);
        const deps = await Promise.all(
          dependsOn.map(dKey => allPreloads[dKey])
        );
        const depsObject: Record<string, any> = {};
        deps.forEach((result, i) => {
          depsObject[dependsOn[i]] = result;
        });
        return depsObject;
      };
      const promise = (async () => {
        const deps = await loadDependencies();
        return this.queryClient.fetchQuery(
          queryKey(deps),
          async context => queryFn(context, deps),
          {
            staleTime,
            cacheTime
          }
        );
      })();
      allPreloads[key] = promise;
      if (waitUntilPreloaded) requiredPreloads.push(promise);
    });
    return Promise.allSettled(requiredPreloads);
  }

  getQueries() {
    const route = useRoute();
    const resolvedData = reactive<Record<string, any>>({});

    const queries: Record<string, ExtendedQuery> = Object.fromEntries(
      Object.entries(this.queriesOptions).flatMap<[string, ExtendedQuery]>(
        ([key, queryDef]) => {
          const queryOptions = computed(() => {
            const {
              queryFn,
              queryKey,
              dependsOn = [],
              ...options
            } = queryDef(route);

            const enabled =
              this.name === route.name &&
              dependsOn.every(key => !!resolvedData[key]);

            const q = {
              ...options,
              queryKey: queryKey(resolvedData),
              queryFn: (ctx: any) => queryFn(ctx, resolvedData),
              enabled
            };
            return q;
          });

          const query = useQuery(queryOptions);
          watch(
            () => query.data,
            data => {
              resolvedData[key] = data;
            },
            { immediate: true }
          );

          query.ssrPrefetch = queryDef(route).ssrPrefetch;

          return [[`${key}Query`, query]];
        }
      )
    );

    onServerPrefetch(() =>
      Promise.allSettled(
        Object.values(queries)
          .filter(q => q.ssrPrefetch)
          .map(q => q.suspense())
      )
    );
    return queries;
  }
}
