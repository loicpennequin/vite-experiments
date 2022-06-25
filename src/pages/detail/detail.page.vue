<script lang="ts" setup>
import { computed } from 'vue';
import { useLoader } from '../../composables/use-loader';

const { pokemonQuery, evolutionsQuery } = useLoader();
const { isLoading: isPokemonLoading, data: pokemon } = pokemonQuery;
const { isLoading: isEvolutionsLoading, data: evolutions } = evolutionsQuery;

const typeLabel = computed(() =>
  pokemon.value.types?.map((t: any) => t.type.name).join(' / ')
);
</script>

<template>
  <div space-y="4" w="screen-sm" max-w="full">
    <template v-if="isPokemonLoading">
      <Surface h="17" animate-pulse />
      <Surface h="9.5rem" animate-pulse />
      <Surface h="26" animate-pulse />
    </template>

    <template v-else-if="pokemon">
      <Surface is="h2" text="3xl" font-bold capitalize rounded="lg">
        {{ pokemon.name }}
      </Surface>

      <Surface rounded="lg">
        <h3>Stats</h3>
        <div flex items="center" flex-wrap>
          <Image :src="pokemon.sprites.front_default" :alt="pokemon.name" />

          <ul grid grid-cols="1 lg:2  " gap="2">
            <StatBar
              v-for="stat in pokemon.stats"
              :key="stat.stat.name"
              is="li"
              :stat="stat"
            />
          </ul>
        </div>
        <div uppercase>{{ typeLabel }}</div>
      </Surface>

      <Surface rounded="lg">
        <h3>Description</h3>
        <div p="3">{{ pokemon.description }}</div>
      </Surface>

      <Surface h="25" animate-pulse v-if="isEvolutionsLoading" />
      <Surface
        rounded="lg"
        v-else-if="evolutions"
        grid
        :grid-cols="evolutions.length"
        gap="3"
      >
        <h3 col-span="full">Evolution Chain</h3>
        <div v-for="(step, index) in evolutions" :key="index">
          <Link
            v-for="pokemon in step"
            :key="pokemon.id"
            :to="{ name: 'Detail', params: { name: pokemon.name } }"
          >
            <figure>
              <Image :src="pokemon.sprites.front_default" :alt="pokemon.name" />
              <figcaption text-center>{{ pokemon.name }}</figcaption>
            </figure>
          </Link>
        </div>
      </Surface>
    </template>
  </div>
</template>

<style scoped lang="scss"></style>
