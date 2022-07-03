import {
  cleanupOutdatedCaches,
  precacheAndRoute,
  createHandlerBoundToURL
} from 'workbox-precaching';
import { NavigationRoute, registerRoute } from 'workbox-routing';
import { NetworkFirst } from 'workbox-strategies';
import { POKEMON_API_URL } from './constants';

declare let self: ServiceWorkerGlobalScope & {
  addEventListener: any;
  skipWaiting: any;
};

self.addEventListener('message', (event: any) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

registerRoute(new NavigationRoute(createHandlerBoundToURL('/?offline')));

registerRoute(
  ({ url }) => url.toString().startsWith(POKEMON_API_URL),
  new NetworkFirst({
    cacheName: 'poke-api'
  })
);
