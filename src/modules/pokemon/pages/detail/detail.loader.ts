import { createLoader } from '@/modules/app/factories/loader.factory';
import { getEvolutionChain, getPokemonByName } from '../../api/pokemon.api';

export default createLoader('Detail', {
  pokemon(route) {
    return {
      queryKey: () => ['pokemon', route.params.name],
      queryFn: () => getPokemonByName(route.params.name as string),
      staleTime: Infinity,
      ssrPrefetch: false,
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
      staleTime: Infinity,
      ssrPrefetch: false
    };
  }
});
