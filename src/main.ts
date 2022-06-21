import { createApp } from 'vue';
import { VueQueryPlugin } from 'vue-query';
import { createRouter, createWebHistory } from 'vue-router';
import App from './app.vue';
import queryClient from './services/query-client.service';

const app = createApp(App)
  .use(VueQueryPlugin, { queryClient })
  .use(
    createRouter({
      history: createWebHistory(),
      routes: [
        {
          name: 'Home',
          path: '/',
          component: () => import('./pages/home/home.page.vue')
        },
        {
          name: 'Detail',
          path: '/:name',
          component: () => import('./pages/detail/detail.page.vue')
        }
      ]
    })
  );

const loaders = import.meta.globEager('./**/*.loader.ts');
app.mount('#app');
