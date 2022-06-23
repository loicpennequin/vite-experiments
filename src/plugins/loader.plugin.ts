import { VitedgePluginContext } from '../types';
import { loaders, createLoader } from '../factories/loader.factory';
import { QueryClient } from 'vue-query';
import { Router } from 'vue-router';

type LoaderModule = {
  default: ReturnType<typeof createLoader>;
};

const bootstrapModules = (queryClient: QueryClient) => {
  const loaderModules = import.meta.globEager<LoaderModule>(
    '../**/*.loader.ts'
  );

  Object.values(loaderModules).forEach(module => {
    module.default(queryClient);
  });
};

const addRouterHook = (router: Router) => {
  router.beforeEach(async (to, from, next) => {
    if (!to.name || !from.name) return next();

    await loaders.get(to.name)?.preload(to);

    next();
  });
};

export default {
  priority: 1,
  install: ({ router, meta }: VitedgePluginContext) => {
    if (!meta.queryClient) {
      throw new Error(
        'LoaderPlugin: no queryClient found on vitedge context. The loader plugin needs to run after the vue query plugin.'
      );
    }

    bootstrapModules(meta.queryClient);

    addRouterHook(router);
  }
};
