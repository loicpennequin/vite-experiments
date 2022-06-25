import { http } from './http.api';

export type GetAllPokemonsOptions = {
  limit: number;
  offset?: number;
};

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
  return {
    ...pokemon,
    species: species,
    description: species.flavor_text_entries
      .find((entry: any) => entry.language.name === 'en')
      .flavor_text.replace('\u000C', ' ')
  };
};

export const getEvolutionChain = async (pokemon: any) => {
  const { data } = await http.get(pokemon.species.evolution_chain.url);
  const { chain } = data;

  const pokemons: any[] = [];
  pokemons.push([await getPokemonByName(chain.species.name)]);

  let link = chain.evolves_to;
  while (link.length) {
    const evolutions = await Promise.all(
      link.map((evolution: any) => getPokemonByName(evolution.species.name))
    );

    pokemons.push(evolutions);
    link = link[0].evolves_to;
  }
  return pokemons;
};
