import { Ref, ref } from 'vue';
import { QueryClient } from 'vue-query';
import { Router } from 'vue-router';
import { ILoader, VitedgePluginContext } from '@/types';
import {
  IS_PRELOADING_INJECTION_KEY,
  LOADERS_INJECTION_KEY
} from '@/constants';
import { createLoader } from '../factories/loader.factory';

type LoaderModule = {
  default: ReturnType<typeof createLoader>;
};

export const loaders = new Map<string | symbol, ILoader<unknown>>();

const bootstrapModules = (queryClient: QueryClient) => {
  const loaderModules = import.meta.globEager<LoaderModule>(
    '../../**/*.loader.ts'
  );

  Object.values(loaderModules).forEach(module => {
    const loader = module.default(queryClient);

    loaders.set(loader.name, loader);
  });
};

const addRouterHook = (router: Router, isPreloading: Ref<boolean>) => {
  router.beforeEach(async (to, from, next) => {
    if (!from.name) return next();

    isPreloading.value = true;
    await Promise.allSettled(
      to.matched
        .map(({ name }) => name && loaders.get(name)?.preload(to))
        .filter(Boolean)
    );
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
