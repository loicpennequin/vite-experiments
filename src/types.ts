import { App } from 'vue';
import { UseQueryReturnType } from 'vue-query';
import { RouteLocationNormalized, Router } from 'vue-router';

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

export interface ILoader<T> {
  name: symbol | string;
  preload(nextRoute: RouteLocationNormalized): Promise<void>;
  getQueries(): Record<string, UseQueryReturnType<T, any>>;
}

export type PromiseRecord = Record<string, Promise<any>>;
