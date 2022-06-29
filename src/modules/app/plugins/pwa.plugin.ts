import { VitedgePluginContext } from '@/types';

export default {
  priority: 1,
  install: ({ isClient, router }: VitedgePluginContext) => {
    if (!isClient) return;
    if (import.meta.env.TEST) return;

    // router.isReady().then(async () => {
    //   // eslint-disable-next-line
    //   // @ts-ignore
    //   const { registerSW } = await import('virtual:pwa-register');
    //   console.log('register service worker');
    //   registerSW({ immediate: true });
    // });
  }
};
