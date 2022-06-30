<script lang="ts" setup>
import { computed } from 'vue';
import { useLoader } from '@/modules/app/composables/use-loader';
import { PokemonDetailLoader } from './detail.loader';

const {
  pokemon: { isLoading: isPokemonLoading, data: pokemon },
  evolutions: { isLoading: isEvolutionsLoading, data: evolutions }
} = useLoader<PokemonDetailLoader>();

const typeLabel = computed(() =>
  pokemon.value?.types?.map(t => t.name).join(' / ')
);
</script>

<template>
  <div space-y="4" w="screen-sm" max-w="full">
    <template v-if="isPokemonLoading">
      <ContentSurface h="17" animate-pulse />
      <ContentSurface h="9.5rem" animate-pulse />
      <ContentSurface h="26" animate-pulse />
    </template>

    <template v-else-if="pokemon">
      <ContentSurface is="h2" text="3xl" font-bold capitalize rounded="lg">
        {{ pokemon.name }}
      </ContentSurface>

      <ContentSurface rounded="lg">
        <h3>Stats</h3>
        <div flex items="center" flex-wrap>
          <LazyImage :src="pokemon.sprites.default" :alt="pokemon.name" />

          <ul grid grid-cols="1 lg:2  " gap="2">
            <PokemonStatBar
              is="li"
              v-for="stat in pokemon.stats"
              :key="stat.name"
              :stat="stat"
            />
          </ul>
        </div>
        <div uppercase>{{ typeLabel }}</div>
      </ContentSurface>

      <ContentSurface rounded="lg">
        <h3>Description</h3>
        <div p="3">{{ pokemon.description }}</div>
      </ContentSurface>

      <ContentSurface v-if="isEvolutionsLoading" h="25" animate-pulse />
      <ContentSurface
        v-else-if="evolutions"
        rounded="lg"
        grid
        :grid-cols="evolutions.length"
        gap="3"
      >
        <h3 col-span="full">Evolution Chain</h3>
        <div v-for="(step, index) in evolutions" :key="index">
          <AppLink
            v-for="evolution in step"
            :key="evolution.id"
            :to="{ name: 'Detail', params: { name: evolution.name } }"
          >
            <figure>
              <LazyImage
                :src="evolution.sprites.default"
                :alt="evolution.name"
              />
              <figcaption text-center>{{ evolution.name }}</figcaption>
            </figure>
          </AppLink>
        </div>
      </ContentSurface>
    </template>
  </div>
</template>

<route lang="json">
{
  "path": "/:name",
  "name": "Detail"
}
</route>
