import { createApp } from 'vue';
import { VueQueryPlugin } from 'vue-query';
import { createRouter, createWebHistory } from 'vue-router';
import App from './app.vue';
import { createLoader } from './factories/loader.factory';
import { createQueryClient } from './factories/query-client.factory';
import { routes } from './routes';

type LoaderModule = {
  default: ReturnType<typeof createLoader>;
};

const queryClient = createQueryClient();
const app = createApp(App)
  .use(VueQueryPlugin, { queryClient })
  .use(
    createRouter({
      history: createWebHistory(),
      routes
    })
  );

const loaders = import.meta.globEager<LoaderModule>('./**/*.loader.ts');
Object.values(loaders).forEach(module => {
  module.default(queryClient);
});

app.mount('#app');
