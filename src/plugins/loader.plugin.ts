import { ILoader, VitedgePluginContext } from '../types';
import { createLoader } from '../factories/loader.factory';
import { QueryClient } from 'vue-query';
import { Router } from 'vue-router';
import {
  IS_PRELOADING_INJECTION_KEY,
  LOADERS_INJECTION_KEY
} from '../constants';
import { Ref, ref } from 'vue';

type LoaderModule = {
  default: ReturnType<typeof createLoader>;
};

export const loaders = new Map<string | symbol, ILoader<unknown>>();

const bootstrapModules = (queryClient: QueryClient) => {
  const loaderModules = import.meta.globEager<LoaderModule>(
    '../**/*.loader.ts'
  );

  Object.values(loaderModules).forEach(module => {
    const loader = module.default(queryClient);

    loaders.set(loader.name, loader);
  });
};

const addRouterHook = (router: Router, isPreloading: Ref<boolean>) => {
  router.beforeEach(async (to, from, next) => {
    if (!to.name || !from.name) return next();
    isPreloading.value = true;
    await loaders.get(to.name)?.preload(to);
    isPreloading.value = false;

    next();
  });
};

export default {
  priority: 1,
  install: ({ app, router, meta }: VitedgePluginContext) => {
    if (!meta.queryClient) {
      throw new Error(
        'LoaderPlugin: no queryClient found on vitedge context. The loader plugin needs to run after the vue query plugin.'
      );
    }

    bootstrapModules(meta.queryClient);

    const isPreloading = ref(false);
    addRouterHook(router, isPreloading);

    if (!import.meta.env.TEST) {
      app.provide(LOADERS_INJECTION_KEY, loaders);
      app.provide(IS_PRELOADING_INJECTION_KEY, isPreloading);
    }
  }
};
