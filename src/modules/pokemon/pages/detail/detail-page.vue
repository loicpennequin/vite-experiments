<script lang="ts" setup>
import { useLoader } from '@/modules/app/composables/use-loader';
import { PokemonDetailLoader } from './detail.loader';
import { useI18n } from 'vue-i18n';

const {
  pokemon: { isLoading: isPokemonLoading, data: pokemon },
  evolutions: { isLoading: isEvolutionsLoading, data: evolutions }
} = useLoader<PokemonDetailLoader>();

const { t } = useI18n();
</script>

<template>
  <div space-y="4" w="screen-sm" max-w="full">
    <template v-if="isPokemonLoading">
      <ContentSurface h="17" animate-pulse />
      <ContentSurface h="9.5rem" animate-pulse />
      <ContentSurface h="26" animate-pulse />
      <ContentSurface h="30" animate-pulse />
    </template>

    <template v-else-if="pokemon">
      <ContentSurface rounded="lg" flex justify-between lt-sm="flex-col" gap-4>
        <h3 font-bold capitalize text-3xl>
          {{ pokemon.id }} - {{ pokemon.name }}
        </h3>

        <span uppercase space-x="2" text="xl lt-sm:base">
          <span
            v-for="pkmnType in pokemon.types"
            :key="pkmnType.name"
            p-2
            rounded-xl
            :style="{ backgroundColor: pkmnType.color }"
          >
            {{ pkmnType.name }}
          </span>
        </span>
      </ContentSurface>

      <ContentBlock rounded="lg" :title="t('headings.stats')">
        <div flex items="center" flex-wrap gap="3">
          <PokemonSprites :pokemon="pokemon" mx="lt-sm:auto" />

          <ul grid grid-cols="1 lg:2  " gap="2">
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

      <ContentSurface v-if="isEvolutionsLoading" h="30" animate-pulse />
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
    }
  }
}
</i18n>

<route lang="json">
{
  "path": "/:name",
  "name": "Detail"
}
</route>
