import { POKEMON_TYPE_COLORS } from '@/constants';
import { ApiResource } from '@/modules/app/models/api-resource.model';
import { Maybe, NamedApiResource } from '@/types';
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

export type PokemonDto = {
  pokemon: IPokemon;
  species: IPokemonSpecies;
};

export class Pokemon extends ApiResource<PokemonDto> {
  static modelId = 'Pokemon';

  id!: number;

  name!: string;

  evolutionChainId!: Maybe<number>;

  height!: number;

  weight!: number;

  description!: string;

  types!: (NamedApiResource & { bg: string; color: string })[];

  stats!: PokemonStat[];

  sprites!: PokemonSprites;

  constructor(dto: PokemonDto) {
    super();
    this.initialize(dto);
  }

  mapFromDtoToModel(dto: PokemonDto): void {
    const { pokemon, species } = dto;
    this.id = pokemon.id;
    this.name = species.name;
    this.height = pokemon.height;
    this.weight = pokemon.weight;
    this.types = pokemon.types.map(type => ({
      ...type.type,
      ...POKEMON_TYPE_COLORS[type.type.name as keyof typeof POKEMON_TYPE_COLORS]
    }));
    this.stats = pokemon.stats.map(stat => ({
      baseStat: stat.base_stat,
      ...stat.stat
    }));
    this.sprites = {
      default: pokemon.sprites.front_default,
      shiny: pokemon.sprites.front_shiny
    };
    this.description = (
      species.flavor_text_entries.find(
        (entry: any) => entry.language.name === 'en'
      ) as IFlavorText
    ).flavor_text.replace('\u000C', ' ');
    this.evolutionChainId = species.evolution_chain
      ? parseInt(species.evolution_chain.url.split('/').reverse()[1])
      : null;
  }
}

export default Pokemon;
