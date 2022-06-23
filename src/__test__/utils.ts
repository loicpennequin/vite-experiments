import { render } from '@testing-library/vue';
import { Component } from 'vue';
import { VueQueryPlugin } from 'vue-query';
import { createRouter, createWebHistory } from 'vue-router';
import { routes as defaultRoutes } from '../routes';

export const renderWithPlugins = (
  component: Component,
  { routes = defaultRoutes } = {}
) => {
  const router = createRouter({
    history: createWebHistory(),
    routes
  });

  return render(component, {
    global: {
      plugins: [router, VueQueryPlugin]
    }
  });
};
