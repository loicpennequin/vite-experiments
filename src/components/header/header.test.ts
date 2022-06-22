import { mount } from '@vue/test-utils';
import { createRouter, createWebHistory } from 'vue-router';
import { routes } from '../../routes';
import Header from './header.vue';

test('mount component', async () => {
  const router = createRouter({
    history: createWebHistory(),
    routes: routes
  });

  router.push('/');
  await router.isReady();
  expect(Header).toBeTruthy();

  const wrapper = mount(Header, { global: { plugins: [router] } });

  expect(wrapper.text()).toContain('Pokédex');
  expect(wrapper.html()).toMatchSnapshot();
});
