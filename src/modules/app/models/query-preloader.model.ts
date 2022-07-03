import { QueryClient } from 'vue-query';
import { RouteLocationNormalized } from 'vue-router';
import { PromiseRecord } from '@/types';
import { LoaderOptions, QueriesOptions, RouteQueryMapFn } from './loader.model';

export class QueryPreloader<T> {
  private queryClient: QueryClient;

  private queriesOptions: QueriesOptions<T>;

  private requiredPreloads: Promise<any>[] = [];

  private preloadsMap: PromiseRecord = {};

  private isPreloading = false;

  constructor({ queryClient, queriesOptions }: Omit<LoaderOptions<T>, 'name'>) {
    this.queryClient = queryClient;
    this.queriesOptions = queriesOptions;
  }

  private sleep(duration: number) {
    return new Promise(res => {
      setTimeout(res, duration);
    });
  }

  private async preloadDependencies(dependsOn: string[]) {
    const deps = await Promise.all(
      dependsOn.map(depKey => this.preloadsMap[depKey])
    );

    return Object.fromEntries(dependsOn.map((depKey, i) => [depKey, deps[i]]));
  }

  private async getPreloadPromise(
    options: ReturnType<RouteQueryMapFn<any, any>>
  ) {
    await this.sleep(0);
    const { queryKey, queryFn, staleTime, cacheTime, dependsOn = [] } = options;
    const deps = await this.preloadDependencies(dependsOn);

    return this.queryClient.fetchQuery(
      queryKey(deps),
      async context => queryFn(context, deps),
      { staleTime, cacheTime }
    );
  }

  private preloadQuery(
    queryDef: RouteQueryMapFn<any, any>,
    nextRoute: RouteLocationNormalized,
    key: string
  ) {
    const options = queryDef(nextRoute);
    const promise = this.getPreloadPromise(options);

    this.preloadsMap[key] = promise;
    if (options.waitUntilPreloaded) this.requiredPreloads.push(promise);
  }

  private async flushRequiredPreloads() {
    await Promise.all(this.requiredPreloads);
    this.requiredPreloads = [];
  }

  private startPreloads(nextRoute: RouteLocationNormalized) {
    Object.entries(this.queriesOptions).forEach(
      ([key, queryDef]: [string, any]) => {
        this.preloadQuery(queryDef, nextRoute, key);
      }
    );
  }

  async run(nextRoute: RouteLocationNormalized) {
    if (!window.navigator.onLine) {
      this.isPreloading = false;
      return;
    }

    if (!this.isPreloading) {
      this.isPreloading = true;
      this.startPreloads(nextRoute);
    }

    await this.flushRequiredPreloads();
    this.isPreloading = false;
  }
}
