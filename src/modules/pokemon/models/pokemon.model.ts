import { NamedApiResource } from '@/types';
import type {
  IPokemon,
  IPokemonSpecies,
  IFlavorText
} from 'pokeapi-typescript';

export type PokemonStat = NamedApiResource & {
  baseStat: number;
};

export type PokemonSprites = {
  default: string;
  shiny: string;
};

export class Pokemon {
  id: number;

  name: string;

  evolutionChainId: number;

  height: number;

  weight: number;

  description?: string;

  types: NamedApiResource[];

  stats: PokemonStat[];

  sprites: PokemonSprites;

  constructor(pokemonDto: IPokemon, speciesDto: IPokemonSpecies) {
    this.id = pokemonDto.id;
    this.name = pokemonDto.name;
    this.height = pokemonDto.height;
    this.weight = pokemonDto.weight;
    this.types = pokemonDto.types.map(type => type.type);
    this.stats = pokemonDto.stats.map(stat => ({
      baseStat: stat.base_stat,
      ...stat.stat
    }));
    this.sprites = {
      default: pokemonDto.sprites.front_default,
      shiny: pokemonDto.sprites.front_shiny
    };
    this.description = (
      speciesDto.flavor_text_entries.find(
        (entry: any) => entry.language.name === 'en'
      ) as IFlavorText
    ).flavor_text.replace('\u000C', ' ');
    this.evolutionChainId = parseInt(
      speciesDto.evolution_chain.url.split('/').reverse()[1]
    );
  }
}
