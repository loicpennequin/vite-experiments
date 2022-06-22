import { App } from 'vue';
import { Router } from 'vue-router';

export type VitedgePluginContext = {
  app: App;
  router: Router;
  isClient: boolean;
  initialState: any;
  initialRoute: any;
  meta: Record<string, any>;
};
