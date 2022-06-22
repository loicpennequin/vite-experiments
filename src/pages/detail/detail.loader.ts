import { getPokemonByName } from '../../api/pokemon.api';
import { createLoader } from '../../factories/loader.factory';

export default createLoader('Detail', {
  pokemon(route) {
    return {
      queryKey: ['pokemon', route.params.name],
      queryFn: () => getPokemonByName(route.params.name as string),
      staleTime: 30_000,
      ssrPrefetch: true,
      waitUntilPreloaded: true
    };
  }
});
