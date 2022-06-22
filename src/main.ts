import { createApp } from 'vue';
import { dehydrate, hydrate, VueQueryPlugin } from 'vue-query';
import { createRouter, createWebHistory, Router } from 'vue-router';
import App from './app.vue';
import { routes } from './routes';
import vitedge from 'vitedge';
import { VitedgePluginContext } from './types';
import 'uno.css';
// import '@unocss/reset/normalize.css';
import '@unocss/reset/tailwind.css';

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
