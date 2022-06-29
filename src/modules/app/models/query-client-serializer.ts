import { DehydratedState } from 'vue-query';
import { ApiResource, isDehydratedModel } from './api-resource.model';

const isObject = (x: unknown): x is Record<string, any> =>
  typeof x === 'object' && x !== null;

export interface ApiResourceConstructor {
  new (dto: any): ApiResource<any>;
  modelId: string;
}

export type ResourceMap = Map<string, ApiResourceConstructor>;

export class QueryClientSerializer {
  constructor(private resourceMap: ResourceMap) {}

  serialize(state: DehydratedState): DehydratedState {
    return {
      mutations: [],
      queries: state.queries.map(query => ({
        ...query,
        state: {
          ...query.state,
          data: this.hydrateQueryData(query.state.data)
        }
      }))
    };
  }

  private hydrateQueryData(data: unknown) {
    if (isObject(data)) {
      return this.maybeInstanciate(data);
    }

    if (Array.isArray(data)) {
      return data.map((item: any) => this.maybeInstanciate(item));
    }

    return data;
  }

  maybeInstanciate(data: Record<string, any>) {
    if (!isDehydratedModel(data)) return data;

    const ctor = this.resourceMap.get(data.__model);
    if (!ctor) {
      throw new Error(`Unknown model : ${data.__model}`);
    }
    return new ctor(data);
  }
}
