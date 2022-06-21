import { computed, inject, toRefs } from 'vue';
import { useRoute } from 'vue-router';

export const useLoader = () => {
  const route = useRoute();
  const loaders = inject('loaders', new Map());

  return loaders.get(route.name)?.getQueries(route);
};
