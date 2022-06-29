<script setup lang="ts">
import { getAllPokemons } from '../../api/pokemon.api';
import { onServerPrefetch, ref } from 'vue';
import { useInfiniteQuery } from 'vue-query';

const emit = defineEmits<{
  (e: 'item-click'): void;
}>();

const {
  data: pokemons,
  fetchNextPage,
  hasNextPage,
  isFetching,
  isLoading,
  suspense
} = useInfiniteQuery(
  ['pokemons'],
  ({ pageParam }) => getAllPokemons({ limit: 50, offset: pageParam }),

  {
    getNextPageParam: lastPage => {
      if (!lastPage.next) return;
      const { searchParams } = new URL(lastPage.next);
      return searchParams.get('offset');
    }
  }
);
onServerPrefetch(suspense);

const onLoadMore = () => {
  console.log('load more');
  if (hasNextPage?.value) {
    fetchNextPage();
  }
};

const scrollRoot = ref<HTMLElement>();
</script>

<template>
  <InfiniteScroll
    :root="scrollRoot?.parentElement"
    :buffer="100"
    @load-more="onLoadMore"
  >
    <ul v-if="pokemons" ref="scrollRoot">
      <template v-for="(page, pageIndex) in pokemons.pages" :key="pageIndex">
        <li v-for="(pokemon, index) in page.results" :key="pokemon.name">
          <AppLink
            :to="{ name: 'Detail', params: { name: pokemon.name } }"
            capitalize
            space-x="1"
            p="3"
            block
            prefetch
            @click="emit('item-click')"
          >
            <span>{{ pageIndex * 50 + index + 1 }} -</span>
            {{ pokemon.name }}
          </AppLink>
        </li>
      </template>
    </ul>
    <LoadingSpinner v-if="isFetching && !isLoading" m-x="auto" />
  </InfiniteScroll>
</template>

<style scoped>
.router-link-exact-active {
  --at-apply: 'bg-red-500';
}
</style>
