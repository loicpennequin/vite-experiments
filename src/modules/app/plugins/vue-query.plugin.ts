import { dehydrate, hydrate, VueQueryPlugin } from 'vue-query';
import { createQueryClient } from '../factories/query-client.factory';
import { VitedgePluginContext } from '@/types';

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
      // Hydrate the client in browser with existing state:
      hydrate(queryClient, initialState.vueQueryState);
    }
  }
};
