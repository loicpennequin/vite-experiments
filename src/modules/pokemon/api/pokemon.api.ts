import { http } from '@/modules/app/api/http.api';
import { Pokemon } from '../models/pokemon.resource';
import {
  IPokemon,
  IPokemonSpecies,
  IEvolutionChain,
  IChainLink
} from 'pokeapi-typescript';

export type GetAllPokemonsOptions = {
  limit: number;
  offset?: number;
};

export type EvoltutionChain = Pokemon[][];

const ENDPOINTS = {
  POKEMON: '/pokemon',
  EVOLUTION_CHAIN: '/evolution-chain',
  SPECIES: '/pokemon-species'
};

const SPECIES_COUNT = 905;

export const getAllPokemons = async ({
  limit,
  offset = 0
}: GetAllPokemonsOptions) => {
  const { data } = await http.get(ENDPOINTS.SPECIES, {
    params: {
      limit,
      offset
    }
  });

  return data;
};

export const getPokemonByName = async (name: string) => {
  console.log('get pokemon by name', name);
  const { data: species } = await http.get<IPokemonSpecies>(
    `${ENDPOINTS.SPECIES}/${name}`
  );
  const { data: pokemon } = await http.get<IPokemon>(
    species.varieties[0].pokemon.url
  );

  return new Pokemon({ pokemon, species });
};

export const getPokemonOfTheDay = async () => {
  const now = new Date();
  const seed = now.getFullYear() + now.getMonth() + now.getDay();

  return getPokemonByName(String(seed % SPECIES_COUNT));
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
  if (!pokemon.evolutionChainId) return [];

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
