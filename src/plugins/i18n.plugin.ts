import { createI18n } from 'vue-i18n';
import { VitedgePluginContext } from '../types';

export default {
  priority: 1,
  install: ({ app }: VitedgePluginContext) => {
    const i18n = createI18n({
      legacy: false,
      locale: 'en',
      messages: {},
      silentFallbackWarn: false
    });

    app.use(i18n);
  }
};
