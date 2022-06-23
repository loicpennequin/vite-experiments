import axios from 'axios';

const http = axios.create({
  baseURL: 'https://pokeapi.co/api/v2/',
  responseType: 'json'
  // withCredentials: true
});

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
