import {
  UseQueryOptions,
  QueryClient,
  useQuery,
  UseQueryReturnType
} from 'vue-query';
import { QueryKey } from 'react-query';
import { useRoute, RouteLocationNormalized } from 'vue-router';
import { computed, onServerPrefetch, Ref } from 'vue';

type RouteQueryMapFn = (
  nextRoute: RouteLocationNormalized
) => UseQueryOptions & {
  queryKey: QueryKey;
  queryFn: any;
  ssrPrefetch?: boolean;
  waitUntilPreloaded?: boolean;
};

export type Loader = {
  preload(nextRoute: RouteLocationNormalized): Promise<any[]>;
  getQueries(): Record<string, any>;
};

type ExtendedQuery = UseQueryReturnType<unknown, unknown> & {
  ssrPrefetch: boolean;
};

export type LoaderMap = Map<string | symbol, Loader>;
export const loaders: LoaderMap = new Map();

export const createLoader =
  (name: string, queriesOptions: Record<string, RouteQueryMapFn>) =>
  (queryClient: QueryClient) => {
    const loader: Loader = {
      preload(nextRoute) {
        const promises: Promise<any>[] = [];

        Object.values(queriesOptions).forEach(queryDef => {
          const {
            queryKey,
            queryFn,
            staleTime,
            cacheTime,
            waitUntilPreloaded
          } = queryDef(nextRoute);

          const promise = queryClient.prefetchQuery(queryKey, queryFn, {
            staleTime,
            cacheTime
          });
          if (waitUntilPreloaded) promises.push(promise);
        });

        return Promise.all(promises);
      },

      getQueries() {
        const route = useRoute();

        const entries = Object.entries(queriesOptions).flatMap<
          [string, ExtendedQuery]
        >(([key, queryDef]) => {
          const query = useQuery(
            computed(() => ({
              ...queryDef(route),
              enabled: name === route.name
            }))
          );
          query.ssrPrefetch = queryDef(route).ssrPrefetch;

          return [[`${key}Query`, query]];
        });

        const queries = Object.fromEntries(entries);
        onServerPrefetch(() =>
          Promise.allSettled(
            Object.values(queries)
              .filter(q => q.ssrPrefetch)
              .map(q => q.suspense())
          )
        );
        return queries;
      }
    };

    loaders.set(name, loader);
    return loader;
  };
