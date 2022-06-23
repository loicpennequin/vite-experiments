import { render } from '@testing-library/vue';
import { App, Component } from 'vue';
import { VueQueryPlugin } from 'vue-query';
import { createRouter, createWebHistory } from 'vue-router';
import { routes as defaultRoutes } from '../routes';
import nock, { Body } from 'nock';
import { POKEMON_API_URL } from '../constants';
import { MockedFunction } from 'vitest';
import { createQueryClient } from '../factories/query-client.factory';
import { PluginModule } from '../types';

export const renderWithPlugins = (
  component: Component,
  { routes = defaultRoutes } = {}
) => {
  const router = createRouter({
    history: createWebHistory(),
    routes
  });

  const queryClient = createQueryClient();
  queryClient.mount();

  const pluginModules = import.meta.globEager<PluginModule>('./**/*.plugin.ts');
  Object.values(pluginModules)
    .map(p => p.default)
    .sort((a, b) => b.priority - a.priority)
    .forEach(plugin => {
      plugin.install?.({
        app: {} as App,
        router,
        isClient: true,
        initialState: undefined,
        initialRoute: undefined,
        meta: {}
      });
    });

  return render(component, {
    global: {
      plugins: [router],
      provide: {
        VUE_QUERY_CLIENT: queryClient
      }
    }
  });
};

type HttpMockOptions<T> = {
  url: string;
  statusCode?: number;
  response: T;
  method?: 'get' | 'post' | 'put' | 'delete';
};

export const httpMock = <T extends Body>({
  url,
  statusCode = 200,
  response,
  method = 'get'
}: HttpMockOptions<T>) => {
  const mock = nock(POKEMON_API_URL).defaultReplyHeaders({
    'access-control-allow-origin': '*',
    'access-control-allow-credentials': 'true'
  });

  mock[method](url).reply(statusCode, response);

  return mock;
};

export const setDeviceWidth = (width: number) => {
  const defaultImplementation = (query: any) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  });

  const mm = window.matchMedia as MockedFunction<any>;

  const getMatch = (query: string) => {
    const isWidthQuery = /(min-width|max-width)/.test(query);
    if (!isWidthQuery) return false;

    const number = query.match(/\d+/)?.[0];
    if (!number) return false;

    const isMinWidthQuery = /min-width/.test(query);

    return isMinWidthQuery ? width >= Number(number) : width <= Number(number);
  };

  mm.mockImplementation((query: any) => {
    return {
      matches: getMatch(query as string),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    };
  });

  afterEach(() => {
    mm.mockImplementation(defaultImplementation);
  });
};
