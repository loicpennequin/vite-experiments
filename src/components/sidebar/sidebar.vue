<script setup lang="ts">
import { getAllPokemons } from '../../api/pokemon.api';
import { onServerPrefetch, ref, watch } from 'vue';
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
const isExpanded = ref(isLargeScreen.value);
</script>

<template>
  <nav
    ref="scrollRoot"
    p-y="3"
    transition-all
    duration-300
    min-w="3rem"
    :class="{ expanded: isLargeScreen || isExpanded }"
  >
    <button
      :title="isExpanded ? 'Hide list' : 'Show list'"
      md="hidden"
      @click="isExpanded = !isExpanded"
    >
      List {{ isExpanded }}
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

.expanded {
  --at-apply: 'min-w-15rem';
}
</style>
