import {
  UseQueryOptions,
  QueryClient,
  useQuery,
  UseQueryReturnType
} from 'vue-query';
import { QueryKey } from 'react-query';
import { useRoute, RouteLocationNormalized } from 'vue-router';
import { computed, onServerPrefetch, ref, Ref } from 'vue';
import { Loader } from '../plugins/loader.plugin';

type RouteQueryMapFn = (
  nextRoute: RouteLocationNormalized
) => UseQueryOptions & {
  queryKey: QueryKey;
  queryFn: any;
  ssrPrefetch?: boolean;
  waitUntilPreloaded?: boolean;
};

type ExtendedQuery = UseQueryReturnType<unknown, unknown> & {
  ssrPrefetch: boolean;
};

export const createLoader =
  (name: string, queriesOptions: Record<string, RouteQueryMapFn>) =>
  (queryClient: QueryClient): Loader => {
    return {
      name,
      async preload(nextRoute) {
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
  };
