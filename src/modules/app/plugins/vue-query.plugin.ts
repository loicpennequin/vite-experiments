import { dehydrate, hydrate, VueQueryPlugin } from 'vue-query';
import { createQueryClient } from '../factories/query-client.factory';
import { VitedgePluginContext } from '@/types';
import {
  ApiResourceConstructor,
  QueryClientSerializer,
  ResourceMap
} from '../models/query-client-serializer';

type ResourceModule = {
  default: ApiResourceConstructor;
};

const makeResourceMap = () => {
  const resourceModules = import.meta.globEager<ResourceModule>(
    '../../**/*.resource.ts'
  );

  const map: ResourceMap = new Map();

  Object.entries(resourceModules).forEach(([path, module]) => {
    if (!module.default) {
      throw new Error(
        `the Api Resource at ${path} is missing a default export.`
      );
    }

    map.set(module.default.modelId, module.default);
  });

  return map;
};

export default {
  priority: 10,
  install: ({ app, meta, initialState }: VitedgePluginContext) => {
    if (import.meta.env.TEST) return;

    const queryClient = createQueryClient();
    meta.queryClient = queryClient;
    app.use(VueQueryPlugin, { queryClient });

    if (import.meta.env.SSR) {
      // This is a placeholder that will return the VueQuery state during SSR:
      initialState.vueQueryState = { toJSON: () => dehydrate(queryClient) };
    } else {
      const resourceMap = makeResourceMap();
      const serializer = new QueryClientSerializer(resourceMap);

      if (initialState.vueQueryState) {
        const serializedState = serializer.serialize(
          initialState.vueQueryState
        );
        hydrate(queryClient, serializedState);
      }
    }
  }
};
