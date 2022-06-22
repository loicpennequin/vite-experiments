import { createApp } from 'vue';
import { dehydrate, hydrate, VueQueryPlugin } from 'vue-query';
import { createRouter, createWebHistory, Router } from 'vue-router';
import App from './app.vue';
import { loaders, createLoader } from './factories/loader.factory';
import { createQueryClient } from './factories/query-client.factory';
import { routes } from './routes';
import vitedge from 'vitedge';
import { VitedgePluginContext } from './types';

export default vitedge(App, { routes }, baseCtx => {
  const ctx: VitedgePluginContext = { ...baseCtx, meta: {} };

  const pluginModules = import.meta.globEager('./**/*.plugin.ts');

  Object.values(pluginModules)
    .map(p => p.default)
    .sort((a, b) => b.priority - a.priority)
    .forEach(plugin => {
      plugin.install?.(ctx);
    });
});
