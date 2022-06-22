import { useQuery, UseQueryOptions, QueryClient } from 'vue-query';
import { QueryKey } from 'react-query';
import { useRoute, RouteLocationNormalized } from 'vue-router';
import { computed, Ref } from 'vue';

type RouteQueryMapFn = (
  nextRoute: RouteLocationNormalized
) => UseQueryOptions & { queryKey: QueryKey; queryFn: any };

type Loader = {
  preload(nextRoute: RouteLocationNormalized): void;
  getQueries(): Record<string, any>;
};
export const loaders = new Map<string | symbol, Loader>();

export const createLoader =
  (name: string, queries: Record<string, RouteQueryMapFn>) =>
  (queryClient: QueryClient) => {
    const loader: Loader = {
      preload(nextRoute) {
        Object.values(queries).forEach(queryDef => {
          const { queryKey, queryFn, staleTime, cacheTime } =
            queryDef(nextRoute);

          queryClient.prefetchQuery(queryKey, queryFn, {
            staleTime,
            cacheTime
          });
        });
      },

      getQueries() {
        const route = useRoute();

        const entries = Object.entries(queries).flatMap(([key, queryDef]) => {
          const query = useQuery(
            computed(() => queryDef(route)) as Ref<UseQueryOptions>
          );
          const data = computed(() => query.data.value);

          return [
            [`${key}Query`, query],
            [key, data]
          ];
        });

        return Object.fromEntries(entries);
      }
    };

    loaders.set(name, loader);

    return loader;
  };
