import { createLoader } from '../../factories/loader.factory';

export default createLoader('Bar', {
  bar() {
    return {
      queryKey: () => ['bar'],
      queryFn: () => {
        console.log('bar');
        return Promise.resolve('bar');
      },
      staleTime: 30_000
    };
  }
});
