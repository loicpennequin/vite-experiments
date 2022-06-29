type DehydratedModel = { __model: string };

export const isDehydratedModel = (x: unknown): x is DehydratedModel =>
  typeof x === 'object' && x !== null && '__model' in x;

export abstract class ApiResource<T> {
  static modelId: string;

  protected initialize(dto: DehydratedModel | T) {
    if (isDehydratedModel(dto)) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { __model, ...rest } = dto;

      Object.assign(this, rest);
    } else {
      this.mapFromDtoToModel(dto);
    }
  }

  abstract mapFromDtoToModel(dto: T): void;

  toJSON() {
    return { ...this, __model: this.constructor.name };
  }
}
