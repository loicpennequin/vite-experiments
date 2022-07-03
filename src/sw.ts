import {
  cleanupOutdatedCaches,
  getCacheKeyForURL,
  precacheAndRoute
} from 'workbox-precaching';
import { NavigationRoute, registerRoute } from 'workbox-routing';
import { NetworkFirst, CacheFirst } from 'workbox-strategies';
import { cacheNames, setCacheNameDetails } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { POKEMON_API_URL } from './constants';

setCacheNameDetails({
  prefix: 'vite-pokedex',
  suffix: 'v1',
  precache: 'precache',
  runtime: 'runtime'
});

declare let self: ServiceWorkerGlobalScope & {
  addEventListener: any;
  skipWaiting: any;
};

self.addEventListener('message', (event: any) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

// Offline HTML handling
const FALLBACK_URL = '/offline-shell';
const htmlHandler = new NetworkFirst({ cacheName: cacheNames.runtime });
registerRoute(
  new NavigationRoute(async options => {
    try {
      const response = await htmlHandler.handle(options);
      if (!response) throw new Error('NetworkFirst fail');

      return response;
    } catch (err) {
      const cache = await caches.open(cacheNames.precache);
      const cacheKey = getCacheKeyForURL(FALLBACK_URL);
      if (!cacheKey) throw new Error(`Non-precached-url: ${FALLBACK_URL}`);

      const fallbackResponse = await cache.match(cacheKey);
      if (fallbackResponse) {
        return fallbackResponse;
      }

      throw err;
    }
  })
);

// Cloud served images
// routing for cloud served images
registerRoute(
  /^https:\/\/.+\.(jpe?g|png|gif|svg)$/i,
  new CacheFirst({
    cacheName: 'vite-pokedex-images-v1',
    plugins: [
      new ExpirationPlugin({
        // Only cache requests for a week
        maxAgeSeconds: 7 * 24 * 60 * 60,
        // Only cache 20 requests.
        maxEntries: 200
      }),
      new CacheableResponsePlugin({
        statuses: [0, 200]
      })
    ]
  })
);
