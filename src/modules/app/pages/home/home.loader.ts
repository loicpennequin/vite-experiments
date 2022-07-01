import { createLoader } from '@/modules/app/factories/loader.factory';
import { getPokemonOfTheDay } from '@/modules/pokemon/api/pokemon.api';
import Pokemon from '@/modules/pokemon/models/pokemon.resource';

export type HomeLoader = {
  pokemonOfTheDay: Pokemon;
};

export default createLoader<HomeLoader>('Home', {
  pokemonOfTheDay() {
    return {
      queryKey: () => ['pokemonOfTheDay'],
      queryFn: () => getPokemonOfTheDay(),
      staleTime: Infinity,
      ssrPrefetch: false,
      waitUntilPreloaded: false
    };
  }
});
