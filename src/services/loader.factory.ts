import { useQuery, UseQueryOptions } from 'vue-query';
import { QueryKey } from 'react-query';
import { useRoute, RouteLocationNormalized } from 'vue-router';
import queryClient from './query-client.service';
import { computed, Ref } from 'vue';

type RouteQueryMapFn = (
  nextRoute: RouteLocationNormalized
) => UseQueryOptions & { queryKey: QueryKey; queryFn: any };

export const loaders = new Map();

export const createLoader = (
  name: string,
  queries: Record<string, RouteQueryMapFn>
) => {
  loaders.set(name, {
    preload(nextRoute: RouteLocationNormalized) {
      Object.values(queries).forEach(queryDef => {
        const { queryKey, queryFn, staleTime, cacheTime } = queryDef(nextRoute);

        queryClient.prefetchQuery(queryKey, queryFn, { staleTime, cacheTime });
      });
    },

    getQueries() {
      const route = useRoute();

      const entries = Object.entries(queries).flatMap(([key, queryDef]) => {
        const query = useQuery(computed(() => queryDef(route)) as Ref<UseQueryOptions>);
        const data = computed(() => query.data.value);

        return [
          [`${key}Query`, query],
          [key, data]
        ];
      });

      return Object.fromEntries(entries);
    }
  });

  return loaders.get(name);
};
