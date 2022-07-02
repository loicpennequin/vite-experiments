<script setup lang="ts">
import { getAllPokemons } from '../../api/pokemon.api';
import { onServerPrefetch, ref, computed } from 'vue';
import { useQuery } from 'vue-query';
import { NamedApiResource } from '@/types';
import { useI18n } from 'vue-i18n';

const emit = defineEmits<{
  (e: 'item-click'): void;
}>();

const { t } = useI18n();

const {
  data: pokemons,
  isLoading,
  suspense
} = useQuery(['pokemons'], () => getAllPokemons({ limit: 905, offset: 0 }), {
  staleTime: Infinity
});

const search = ref('');
const filteredPokemons = computed(() =>
  pokemons.value?.results.filter((pokemon: NamedApiResource) =>
    pokemon.name.includes(search.value.toLocaleLowerCase())
  )
);
onServerPrefetch(suspense);
</script>

<template>
  <ContentSurface sticky p="2" top="0">
    <input
      v-model="search"
      bg="white dark:dark-300"
      p="2"
      border="1 solid slate-400 dark:slate-600"
      :placeholder="t('searchLabel')"
      :aria-label="t('searchLabel')"
    />
  </ContentSurface>
  <LoadingSpinner v-if="isLoading" m-x="auto" h-full />
  <template v-if="pokemons">
    <ul overflow-y-auto>
      <li v-for="pokemon in filteredPokemons" :key="pokemon.name">
        <AppLink
          :to="{ name: 'Detail', params: { name: pokemon.name } }"
          capitalize
          space-x="1"
          p="3"
          block
          prefetch
          @click="emit('item-click')"
        >
          {{ pokemon.name }}
        </AppLink>
      </li>
    </ul>
  </template>
</template>

<style scoped>
.router-link-exact-active {
  --at-apply: 'bg-light-300 dark:bg-dark-200';
}
</style>

<i18n lang="json">
{
  "en": {
    "searchLabel": "Search for a Pokémon"
  }
}
</i18n>
