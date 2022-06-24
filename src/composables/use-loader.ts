import { inject } from 'vue';
import { useRoute } from 'vue-router';
import { LOADERS_INJECTION_KEY } from '../constants';

export const useLoader = () => {
  const route = useRoute();
  const loaders = inject(LOADERS_INJECTION_KEY, new Map());

  return loaders.get(route.name)?.getQueries(route);
};
