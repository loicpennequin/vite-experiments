export const routes = [
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
];
