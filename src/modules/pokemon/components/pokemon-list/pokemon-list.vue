<script setup lang="ts">
import { getAllPokemons } from '../../api/pokemon.api';
import { ref, computed } from 'vue';
import { useQuery } from 'vue-query';
import { NamedApiResource } from '@/types';
import { useI18n } from 'vue-i18n';
import { RecycleScroller } from 'vue-virtual-scroller';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';

const emit = defineEmits<{
  (e: 'item-click'): void;
}>();

const { t } = useI18n();

const { data: pokemons, isLoading } = useQuery(
  ['pokemons'],
  () => getAllPokemons({ limit: 905, offset: 0 }),
  {
    staleTime: Infinity
  }
);

const search = ref('');
const filteredPokemons = computed(() =>
  pokemons.value?.results.filter((pokemon: NamedApiResource) =>
    pokemon.name.includes(search.value.toLocaleLowerCase())
  )
);
</script>

<template>
  <ContentSurface p="2" sticky top="0" z-1>
    <input
      v-model="search"
      :aria-label="t('searchLabel')"
      bg="white dark:dark-300"
      border="1 solid slate-400 dark:slate-600"
      p="2"
      :placeholder="t('searchLabel')"
    />
  </ContentSurface>

  <LoadingSpinner v-if="isLoading" h-full m-x="auto" />
  <RecycleScroller
    v-if="pokemons"
    v-slot="{ item: pokemon }"
    h-full
    item-size="32"
    :items="filteredPokemons"
    key-field="name"
  >
    <AppLink
      block
      capitalize
      h="32px"
      p-x="3"
      prefetch
      space-x="1"
      :to="{ name: 'Detail', params: { name: pokemon.name } }"
      @click="emit('item-click')"
    >
      {{ pokemon.name }}
    </AppLink>
  </RecycleScroller>
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
