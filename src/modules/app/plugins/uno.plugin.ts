import initUnocssRuntime from '@unocss/runtime';
import presetWind from '@unocss/preset-wind';
import presetAttributify from '@unocss/preset-attributify';
import { VitedgePluginContext } from '@/types';

export default {
  priority: 1,
  install: ({ isClient }: VitedgePluginContext) => {
    if (!isClient) return;

    initUnocssRuntime({
      defaults: {
        presets: [presetWind(), presetAttributify()]
      }
    });
  }
};
