<script setup lang="ts">
import { getAllPokemons } from '../../api/pokemon.api';
import { onServerPrefetch, ref, computed } from 'vue';
import { useInfiniteQuery } from 'vue-query';
import { useMediaQuery } from '@vueuse/core';

const {
  data: pokemons,
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

const isLargeScreen = useMediaQuery('(min-width: 1024px)');
const isExpanded = ref(isLargeScreen.value || import.meta.env.SSR);
</script>

<template>
  <nav
    ref="scrollRoot"
    p-y="3"
    transition-all
    duration-300
    :min-w="isLargeScreen || isExpanded ? '15rem' : '3rem'"
  >
    <button
      :title="isExpanded ? 'Hide list' : 'Show list'"
      md="hidden"
      w="full"
      flex
      :justify="isExpanded ? 'start' : 'center'"
      items="center"
      gap="3"
      px="3"
      @click="isExpanded = !isExpanded"
    >
      <template v-if="isExpanded">
        <icon-pkmn-arrows-right h="8" />
        <span>Hide List</span>
      </template>
      <icon-pkmn-arrows-left v-else h="8" />
    </button>
    <transition name="pkmn-list">
      <div v-if="isExpanded || isLargeScreen">
        <InfiniteScroll
          @load-more="onLoadMore"
          :root="scrollRoot"
          :buffer="100"
        >
          <ul v-if="pokemons">
            <template
              v-for="(page, pageIndex) in pokemons.pages"
              :key="pageIndex"
            >
              <li v-for="(pokemon, index) in page.results" :key="pokemon.name">
                <Link
                  :to="{ name: 'Detail', params: { name: pokemon.name } }"
                  capitalize
                  space-x="1"
                  p="3"
                  block
                  prefetch
                  @click="isExpanded = false"
                >
                  <span>{{ pageIndex * 50 + index + 1 }} -</span>
                  {{ pokemon.name }}
                </Link>
              </li>
            </template>
          </ul>
        </InfiniteScroll>
      </div>
    </transition>
  </nav>
</template>

<style scoped>
.router-link-exact-active {
  --at-apply: 'bg-red-500';
}
</style>
