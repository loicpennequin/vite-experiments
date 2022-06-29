import { http } from '@/modules/app/api/http.api';
import { Pokemon } from '../models/pokemon.model';

export type GetAllPokemonsOptions = {
  limit: number;
  offset?: number;
};

export type EvoltutionChain = Pokemon[][];

export const getAllPokemons = async ({
  limit,
  offset = 0
}: GetAllPokemonsOptions) => {
  const { data } = await http.get('/pokemon', {
    params: {
      limit,
      offset
    }
  });

  return data;
};

export const getPokemonByName = async (name: string) => {
  const { data: pokemon } = await http.get(`pokemon/${name}`);

  const { data: species } = await http.get(pokemon.species.url);
  pokemon.species = species;

  return new Pokemon(pokemon, species);
};

export const getEvolutionChain = async (pokemon: Pokemon) => {
  const { data } = await http.get(
    `/evolution-chain/${pokemon.evolutionChainId}`
  );
  const { chain } = data;

  const pokemons: EvoltutionChain = [];
  pokemons.push([await getPokemonByName(chain.species.name)]);

  let link = chain.evolves_to;
  while (link.length) {
    const evolutions = await Promise.all(
      link.map((evolution: any) => {
        if (evolution.species.name === pokemon.name) {
          return Promise.resolve(pokemon);
        }

        return getPokemonByName(evolution.species.name);
      })
    );

    pokemons.push(evolutions);
    link = link[0].evolves_to;
  }

  return pokemons;
};
