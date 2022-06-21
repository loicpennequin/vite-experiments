/// <reference types="vite/client" />
import * as vueQuery from 'vue-query';

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module 'vue-query' {
  function useQuery<
    TQueryFnData = unknown,
    TError = unknown,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey
  >(
    options:
      | UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>
      | Ref<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>>
  ): UseQueryReturnType<TData, TError>;
}
