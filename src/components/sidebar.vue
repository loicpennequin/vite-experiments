<script setup lang="ts">
import { useInfiniteQuery } from 'vue-query';
import { getAllPokemons } from '../api/pokemon.api';
import Link from './link.vue';
import InfiniteScroll from './infinite-scroll.vue';
import { ref } from 'vue';

const {
  data: pokemons,
  isLoading,
  fetchNextPage,
  hasNextPage
} = useInfiniteQuery(
  'pokemons',
  ({ pageParam }) => getAllPokemons({ limit: 30, offset: pageParam }),
  {
    getNextPageParam: lastPage => {
      if (!lastPage.next) return;
      const { searchParams } = new URL(lastPage.next);
      return searchParams.get('offset');
    }
  }
);

const onLoadMore = () => {
  if (hasNextPage?.value) {
    fetchNextPage.value();
  }
};

const scrollRoot = ref<HTMLElement>();
</script>

<template>
  <nav ref="scrollRoot">
    <InfiniteScroll @load-more="onLoadMore" :root="scrollRoot" :buffer="100">
      <div v-if="isLoading">Loading pokemons...</div>
      <ul v-if="pokemons">
        <template v-for="(page, index) in pokemons.pages" :key="index">
          <li v-for="pokemon in page.results" :key="pokemon.name">
            <Link
              :to="{ name: 'Detail', params: { name: pokemon.name } }"
              prefetch
            >
              {{ pokemon.name }}
            </Link>
          </li>
        </template>
      </ul>
    </InfiniteScroll>
  </nav>
</template>

<style lang="scss" scoped>
nav {
  padding: 1em;
}

nav ul {
  list-style: none;
  padding: 0;
  margin: 0;

  > li:not(:last-child) {
    margin-bottom: 0.5rem;
  }
}
</style>
