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

export type PluginModule = {
  default: {
    install(ctx: VitedgePluginContext): void;
    priority: number;
  };
};
