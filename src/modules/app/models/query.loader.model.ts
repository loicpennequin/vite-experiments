import { computed, onServerPrefetch, reactive, watch } from 'vue';
import { useQuery, UseQueryReturnType } from 'vue-query';
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router';
import { LoaderOptions, QueriesOptions, RouteQueryMapFn } from './loader.model';

export class QueryLoader<T> {
  name: string;

  private queriesOptions: QueriesOptions<T>;

  private resolvedData = reactive<Record<string, any>>({});

  constructor({ name, queriesOptions }: Omit<LoaderOptions<T>, 'queryClient'>) {
    this.name = name;
    this.queriesOptions = queriesOptions;
  }

  private getQueries(route: RouteLocationNormalizedLoaded, ssrQueries: any[]) {
    const entries = Object.entries<RouteQueryMapFn<any, any>>(
      this.queriesOptions
    ).map(([key, queryDef]) => {
      const query = this.getQuery(queryDef, route, key, ssrQueries);

      return [key, query];
    });

    return Object.fromEntries(entries);
  }

  private getQuery(
    queryDef: RouteQueryMapFn<any, any>,
    route: RouteLocationNormalizedLoaded,
    key: string,
    ssrQueries: any[]
  ) {
    const query = useQuery(
      computed(() => this.getQueryOptions(queryDef, route))
    );

    watch(
      () => query.data,
      data => {
        this.resolvedData[key] = data;
      },
      { immediate: true }
    );

    if (queryDef(route).ssrPrefetch) {
      ssrQueries.push(query);
    }

    return query;
  }

  private getQueryOptions(
    queryDef: RouteQueryMapFn<any, any>,
    route: RouteLocationNormalizedLoaded
  ) {
    const { queryFn, queryKey, dependsOn = [], ...options } = queryDef(route);

    const enabled =
      this.name === route.name &&
      dependsOn.every(key => !!this.resolvedData[key]);

    return {
      ...options,
      queryKey: queryKey(this.resolvedData),
      queryFn: (ctx: any) => queryFn(ctx, this.resolvedData),
      enabled
    };
  }

  run() {
    const route = useRoute();
    const ssrQueries: UseQueryReturnType<unknown, unknown>[] = [];
    const queries = this.getQueries(route, ssrQueries);

    onServerPrefetch(() =>
      Promise.allSettled(ssrQueries.map(q => q.suspense()))
    );

    return queries;
  }
}
