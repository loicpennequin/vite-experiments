import { RouteRecordRaw } from 'vue-router';

export const routes: RouteRecordRaw[] = [
  {
    name: 'Home',
    path: '/',
    component: () => import('./pages/home/home.page.vue')
  },
  {
    name: 'Detail',
    path: '/:name',
    component: () => import('./pages/detail/detail.page.vue')
  },
  {
    name: 'Foo',
    path: '/foo',
    component: () => import('./pages/foo/foo.page.vue'),
    children: [
      {
        name: 'Bar',
        path: 'bar',
        component: () => import('./pages/foo/bar.page.vue')
      }
    ]
  }
];
