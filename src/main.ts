import 'uno.css';
import '@unocss/reset/tailwind.css';
import vitedge from 'vitedge';
import App from './app.vue';
import { VitedgePluginContext } from './types';
import routes from '~pages';

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
