import {
  cleanupOutdatedCaches,
  precacheAndRoute,
  createHandlerBoundToURL
} from 'workbox-precaching';
import { NavigationRoute, registerRoute } from 'workbox-routing';

declare let self: ServiceWorkerGlobalScope & {
  addEventListener: any;
  skipWaiting: any;
};

self.addEventListener('message', (event: any) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

const manifest = self.__WB_MANIFEST;
console.log(manifest);
precacheAndRoute(manifest);
registerRoute(new NavigationRoute(createHandlerBoundToURL('/?offline')));

// self.addEventListener('fetch', (event: any) => {
//   // if (event.request.mode !== 'navigate') return;
//   // let { request } = event;
//   // const shellUrl = shellUrlsToCache.find(url => request.url.endsWith(url));
//   // let request = event.request;
//   // const shellUrl = shellUrlsToCache.find(url => request.url.endsWith(url));
//   // if (shellUrl) {
//   //   // here is real magic!
//   //   request = new Request(`${shellUrl}?shell`);
//   // }
//   // event.respondWith(
//   //   caches.match(request).then(response => response || fetch(request))
//   // );
// });

cleanupOutdatedCaches();

// to allow work offline
// registerRoute(
//   ({ url, request, event }) => {
//     console.log('MATCH CB', url.pathname);
//     return false;
//     // return url.pathname === '/special/url';
//   },
//   new NetworkFirst({
//     cacheName: 'pwa-start-url',
//     plugins: [
//       {
//         cacheWillUpdate: async ({ request, response, event }) => {
//           // Return `response`, a different `Response` object, or `null`.
//           console.log('cache will update');
//           return response;
//         },
//         cacheDidUpdate: async ({
//           cacheName,
//           request,
//           oldResponse,
//           newResponse,
//           event
//         }) => {
//           console.log('cache did update');
//           // No return expected
//           // Note: `newResponse.bodyUsed` is `true` when this is called,
//           // meaning the body has already been read. If you need access to
//           // the body of the fresh response, use a technique like:
//           // const freshResponse = await caches.match(request, {cacheName});
//         },
//         cacheKeyWillBeUsed: async ({ request, mode }) => {
//           console.log('cache key will be used', request.url, mode);
//           // `request` is the `Request` object that would otherwise be used as the cache key.
//           // `mode` is either 'read' or 'write'.
//           // Return either a string, or a `Request` whose `url` property will be used as the cache key.
//           // Returning the original `request` will make this a no-op.
//           return request;
//         },
//         cachedResponseWillBeUsed: async ({
//           cacheName,
//           request,
//           matchOptions,
//           cachedResponse,
//           event
//         }) => {
//           console.log('cached response will be used', cacheName);
//           // Return `cachedResponse`, a different `Response` object, or null.
//           return cachedResponse;
//         },
//         requestWillFetch: async ({ request }) => {
//           console.log('request will fetch', request.url);
//           // Return `request` or a different `Request` object.
//           return request;
//         },
//         fetchDidFail: async ({ originalRequest, request, error, event }) => {
//           console.log('fetch did fail');
//           // No return expected.
//           // NOTE: `originalRequest` is the browser's request, `request` is the
//           // request after being passed through plugins with
//           // `requestWillFetch` callbacks, and `error` is the exception that caused
//           // the underlying `fetch()` to fail.
//         },
//         fetchDidSucceed: async ({ request, response }) => {
//           console.log('request did succeed');
//           // Return `response` to use the network response as-is,
//           // or alternatively create and return a new `Response` object.
//           return response;
//         }
//       }
//     ]
//   })
//   // new NavigationRoute(
//   // )
// );
// registerRoute(new NavigationRoute((options) => {
//       options.request = new Request(url);
//       options.params = Object.assign({ cacheKey }, options.params);
//       return this.strategy.handle(options);
//     }));
