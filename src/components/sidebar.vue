<script setup lang="ts">
import { getAllPokemons } from '../api/pokemon.api';
import { onServerPrefetch, ref } from 'vue';
import { useInfiniteQuery } from 'vue-query';

const {
  data: pokemons,
  isLoading,
  fetchNextPage,
  hasNextPage,
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
  if (hasNextPage?.value) {
    fetchNextPage();
  }
};

const scrollRoot = ref<HTMLElement>();
</script>

<template>
  <nav ref="scrollRoot" p-y="3">
    <InfiniteScroll @load-more="onLoadMore" :root="scrollRoot" :buffer="100">
      <div v-if="isLoading">Loading pokemons...</div>
      <ul v-if="pokemons">
        <template v-for="(page, pageIndex) in pokemons.pages" :key="pageIndex">
          <li v-for="(pokemon, index) in page.results" :key="pokemon.name">
            <Link
              :to="{ name: 'Detail', params: { name: pokemon.name } }"
              prefetch
              capitalize
              space-x="1"
              p="3"
              block
            >
              <span>{{ pageIndex * 50 + index + 1 }} -</span>
              {{ pokemon.name }}
            </Link>
          </li>
        </template>
      </ul>
    </InfiniteScroll>
  </nav>
</template>

<style>
.router-link-exact-active {
  --at-apply: 'bg-red-500';
}
</style>
