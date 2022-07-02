<script setup lang="ts">
import { getAllPokemons } from '../../api/pokemon.api';
import { ref, computed, onServerPrefetch, onMounted } from 'vue';
import { useQuery } from 'vue-query';
import { NamedApiResource } from '@/types';
import { useI18n } from 'vue-i18n';
import { RecycleScroller } from 'vue-virtual-scroller';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';
import { useRoute } from 'vue-router';

const emit = defineEmits<{
  (e: 'item-click'): void;
}>();

const { t } = useI18n();
const route = useRoute();
const page = computed(() => Number(route.query.sidebar_page ?? 1));

const SSR_RESULT_PER_PAGE = 35;
const ITEM_HEIGHT = 32;

const {
  data: pokemons,
  suspense,
  isLoading
} = useQuery(
  ['pokemons'],
  async () => {
    const data = await getAllPokemons({ limit: 905, offset: 0 });
    // we filter only the elements visible on screen to avoid inlining too much state in the html file during SSR
    // this would result in a html file way too heavy
    if (!import.meta.env.SSR) return data;

    const offset = (page.value - 1) * SSR_RESULT_PER_PAGE;
    return {
      ...data,
      result: data.results.slice(offset, offset + SSR_RESULT_PER_PAGE)
    };
  },
  {
    staleTime: 0
  }
);

onServerPrefetch(suspense);

const search = ref('');

const filteredPokemons = computed(() =>
  pokemons.value?.results.filter((pokemon: NamedApiResource) =>
    pokemon.name.includes(search.value.toLocaleLowerCase())
  )
);

const virtualScrollRoot = ref<any>();
onMounted(() => {
  if (page.value <= 1) return;
  setTimeout(() => {
    virtualScrollRoot.value.$el.scrollTop =
      (page.value - 1) * SSR_RESULT_PER_PAGE * ITEM_HEIGHT;
  });
});
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
    ref="virtualScrollRoot"
    v-slot="{ item: pokemon }"
    h-full
    :item-size="ITEM_HEIGHT"
    :items="filteredPokemons"
    key-field="name"
    :prerender="SSR_RESULT_PER_PAGE"
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

  <div v-if="!virtualScrollRoot" flex justify-between p="2" underline>
    <router-link v-if="page > 1" :to="{ query: { sidebar_page: page - 1 } }">
      Previous
    </router-link>
    <router-link :to="{ query: { sidebar_page: page + 1 } }">Next</router-link>
  </div>
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
