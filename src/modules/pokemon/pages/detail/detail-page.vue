<script lang="ts" setup>
import { useLoader } from '@/modules/app/composables/use-loader';
import { PokemonDetailLoader } from './detail.loader';
import { useI18n } from 'vue-i18n';

const {
  pokemon: { isLoading: isPokemonLoading, data: pokemon, error },
  evolutions: { isLoading: isEvolutionsLoading, data: evolutions }
} = useLoader<PokemonDetailLoader>();

const { t } = useI18n();
</script>

<template>
  <div max-w="full" space-y="4" w="screen-sm">
    <template v-if="isPokemonLoading">
      <ContentSurface animate-pulse h="17" />
      <ContentSurface animate-pulse h="42" />
      <ContentSurface animate-pulse h="26" />
      <ContentSurface animate-pulse h="30" />
    </template>

    <template v-else-if="error">
      <ContentSurface>{{ t('error') }}</ContentSurface>
    </template>

    <template v-else-if="pokemon">
      <ContentSurface flex gap-4 justify-between lt-sm="flex-col" rounded="lg">
        <h2 capitalize font-bold text-3xl>
          {{ pokemon.id }} - {{ pokemon.name }}
        </h2>

        <span space-x="2" text="xl lt-sm:base" uppercase>
          <span
            v-for="pkmnType in pokemon.types"
            :key="pkmnType.name"
            p-2
            rounded-xl
            :style="{ backgroundColor: pkmnType.bg, color: pkmnType.color }"
          >
            {{ pkmnType.name }}
          </span>
        </span>
      </ContentSurface>

      <ContentBlock rounded="lg" :title="t('headings.stats')">
        <div flex flex-wrap gap="3" items="center">
          <PokemonSprites mx="lt-sm:auto" :pokemon="pokemon" />

          <ul gap="2" grid grid-cols="1 lg:2  ">
            <PokemonStatBar
              is="li"
              v-for="stat in pokemon.stats"
              :key="stat.name"
              :stat="stat"
            />
          </ul>
        </div>
      </ContentBlock>

      <ContentBlock rounded="lg" :title="t('headings.description')">
        {{ pokemon.description }}
      </ContentBlock>

      <ContentSurface v-if="isEvolutionsLoading" animate-pulse h="30" />
      <ContentBlock
        v-else-if="evolutions"
        rounded="lg"
        :title="t('headings.evolution')"
      >
        <PokemonEvolutionChain :evolution-chain="evolutions" />
      </ContentBlock>
    </template>
  </div>
</template>

<i18n lang="json">
{
  "en": {
    "headings": {
      "stats": "Stats",
      "description": "Description",
      "evolution": "Evolution Chain"
    },
    "error": "Could not get the pokémon information"
  }
}
</i18n>

<route lang="json">
{
  "path": "/pokemon/:name",
  "name": "Detail"
}
</route>
