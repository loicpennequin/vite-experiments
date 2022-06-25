import { getEvolutionChain, getPokemonByName } from '../../api/pokemon.api';
import { createLoader } from '../../factories/loader.factory';

export default createLoader('Detail', {
  pokemon(route) {
    return {
      queryKey: () => ['pokemon', route.params.name],
      queryFn: () => getPokemonByName(route.params.name as string),
      staleTime: 30_000,
      ssrPrefetch: true,
      waitUntilPreloaded: true
    };
  },
  evolutions() {
    return {
      queryKey: ({ pokemon }) => [
        'evolutionChain',
        pokemon?.species.evolution_chain.url.split('/').reverse()[1] // url ends with trailing slash
      ],
      queryFn: (ctx, { pokemon }) => {
        return getEvolutionChain(pokemon);
      },
      dependsOn: ['pokemon'],
      staleTime: 30_000,
      ssrPrefetch: true
    };
  }
});
