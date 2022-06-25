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
  evolutionChain() {
    return {
      queryKey: ({ pokemon }) => [
        'evolutionChain',
        pokemon?.species.evolution_chain.url.split('/').reverse()[0]
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
