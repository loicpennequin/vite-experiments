<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useMediaQuery } from '@vueuse/core';

const scrollRoot = ref<HTMLElement>();
const isExpanded = ref(true);

const isLargeScreen = useMediaQuery('(min-width: 1024px)');
watch(isLargeScreen, isLargeScreen => {
  isExpanded.value = isLargeScreen;
});

onMounted(() => {
  isExpanded.value = isLargeScreen.value;
});

const onItemClick = () => {
  if (!isLargeScreen.value) {
    isExpanded.value = false;
  }
};
</script>

<template>
  <nav
    ref="scrollRoot"
    p-y="3"
    transition-all
    duration-300
    :min-w="isExpanded ? '15rem' : '3rem'"
  >
    <button
      md="hidden"
      :title="isExpanded ? 'Hide list' : 'Show list'"
      w="full"
      flex
      :justify="isExpanded ? 'start' : 'center'"
      items="center"
      gap="3"
      bg="red-400"
      px="3"
      @click="isExpanded = !isExpanded"
    >
      <template v-if="isExpanded">
        <icon-pkmn-arrows-right h="8" />
        <span>Hide list</span>
      </template>
      <icon-pkmn-arrows-left v-else h="8" />
    </button>

    <transition name="pkmn-list">
      <div v-if="isExpanded" bg="red-400">
        <PokemonList @item-click="onItemClick" />
      </div>
    </transition>
  </nav>
</template>

<style scoped>
.router-link-exact-active {
  --at-apply: 'bg-red-500';
}
</style>
