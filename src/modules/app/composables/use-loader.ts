import { inject } from 'vue';
import { useRoute } from 'vue-router';
import { LOADERS_INJECTION_KEY } from '@/constants';
import { UseQueryReturnType } from 'vue-query';

type UseLoaderReturnType<T> = {
  [Property in keyof T]: UseQueryReturnType<T[Property], any>;
};
export const useLoader = <
  T extends Record<string, any> = Record<string, any>
>(): UseLoaderReturnType<T> => {
  const route = useRoute();
  const loaders = inject(LOADERS_INJECTION_KEY, new Map());

  return Object.assign(
    {},
    ...route.matched
      .map(({ name }) => loaders.get(name)?.getQueries())
      .filter(Boolean)
  );
};
