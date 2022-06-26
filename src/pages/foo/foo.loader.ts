import { createLoader } from '../../factories/loader.factory';

export default createLoader('Foo', {
  foo() {
    return {
      queryKey: () => ['foo'],
      queryFn: () => {
        console.log('foo');
        return Promise.resolve('foo');
      },
      staleTime: 30_000
    };
  }
});
