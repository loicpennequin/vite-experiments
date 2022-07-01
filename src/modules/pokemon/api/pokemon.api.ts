import { http } from '@/modules/app/api/http.api';
import { Pokemon } from '../models/pokemon.resource';
import {
  IPokemon,
  IPokemonSpecies,
  IEvolutionChain,
  IChainLink,
  INamedApiResourceList
} from 'pokeapi-typescript';

export type GetAllPokemonsOptions = {
  limit: number;
  offset?: number;
};

export type EvoltutionChain = Pokemon[][];

const ENDPOINTS = {
  POKEMON: '/pokemon',
  EVOLUTION_CHAIN: '/evolution-chain',
  POKEMON_SPECIES: '/pokemon-species'
};

export const getAllPokemons = async ({
  limit,
  offset = 0
}: GetAllPokemonsOptions) => {
  const { data } = await http.get(ENDPOINTS.POKEMON_SPECIES, {
    params: {
      limit,
      offset
    }
  });

  return data;
};

export const getPokemonByName = async (name: string) => {
  const { data: pokemon } = await http.get<IPokemon>(
    `${ENDPOINTS.POKEMON}/${name}`
  );

  const { data: species } = await http.get<IPokemonSpecies>(
    pokemon.species.url
  );

  return new Pokemon({ pokemon, species });
};

export const getPokemonOfTheDay = async () => {
  const now = new Date();
  const seed = now.getFullYear() + now.getMonth() + now.getDay();

  const { data: species } = await http.get<
    INamedApiResourceList<IPokemonSpecies>
  >(ENDPOINTS.POKEMON_SPECIES, { params: { limit: 1 } });

  return getPokemonByName(String(seed % species.count));
};

export const getPokemonsByEvolutionLink = (
  links: IChainLink[],
  pokemon?: Pokemon
) => {
  return Promise.all(
    links.map(link => {
      if (link.species.name === pokemon?.name) {
        return Promise.resolve(pokemon);
      }

      return getPokemonByName(link.species.name);
    })
  );
};

export const getEvolutionChain = async (pokemon: Pokemon) => {
  const { data } = await http.get<IEvolutionChain>(
    `${ENDPOINTS.EVOLUTION_CHAIN}/${pokemon.evolutionChainId}`
  );

  const chain: EvoltutionChain = [];
  if (data.chain.species.name === pokemon.name) {
    chain.push([pokemon]);
  } else {
    chain.push([await getPokemonByName(data.chain.species.name)]);
  }

  let link = data.chain.evolves_to;
  while (link.length) {
    chain.push(await getPokemonsByEvolutionLink(link, pokemon));
    link = link[0].evolves_to;
  }

  return chain;
};
