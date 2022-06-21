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
  const { data } = await http.get(`pokemon/${name}`);

  return data;
};
