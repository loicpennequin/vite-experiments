import { createLoader } from '@/modules/app/factories/loader.factory';
import {
  EvoltutionChain,
  getEvolutionChain,
  getPokemonByName
} from '../../api/pokemon.api';
import { Pokemon } from '../../models/pokemon.resource';

export type PokemonDetailLoader = {
  pokemon: Pokemon;
  evolutions: EvoltutionChain;
};

export default createLoader<PokemonDetailLoader>('Detail', {
  pokemon(route) {
    return {
      queryKey: () => ['pokemon', route.params.name],
      queryFn: () => getPokemonByName(route.params.name as string),
      staleTime: Infinity,
      ssrPrefetch: true,
      waitUntilPreloaded: true
    };
  },
  evolutions() {
    return {
      queryKey: ({ pokemon }) => ['evolutionChain', pokemon?.evolutionChainId],
      queryFn: (_ctx, { pokemon }) => getEvolutionChain(pokemon),
      dependsOn: ['pokemon'],
      staleTime: Infinity,
      ssrPrefetch: false,
      waitUntilPreloaded: false
    };
  }
});
