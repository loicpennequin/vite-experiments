import { VitedgePluginContext } from '../types';
import { loaders, createLoader } from '../factories/loader.factory';

type LoaderModule = {
  default: ReturnType<typeof createLoader>;
};

export default {
  priority: 1,
  install: ({ router, meta }: VitedgePluginContext) => {
    const loaderModules = import.meta.globEager<LoaderModule>(
      '../**/*.loader.ts'
    );
    Object.values(loaderModules).forEach(module => {
      module.default(meta.queryClient);
    });

    router.beforeEach(async (to, from, next) => {
      if (!to.name || !from.name) return next();

      await loaders.get(to.name)?.preload(to);

      next();
    });
  }
};
