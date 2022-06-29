<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { useMediaQuery } from '@vueuse/core';

const props = defineProps<{ isOpened: boolean }>();
const emit = defineEmits<{
  (e: 'update:isOpened', value: boolean): void;
}>();

const isLargeScreen = useMediaQuery('(min-width: 1024px)');
watch(isLargeScreen, isLargeScreen => {
  emit('update:isOpened', isLargeScreen);
});

onMounted(() => {
  emit('update:isOpened', isLargeScreen.value);
});

const onItemClick = () => {
  if (!isLargeScreen.value) {
    emit('update:isOpened', false);
  }
};
</script>

<template>
  <transition>
    <nav
      v-if="props.isOpened"
      p-y="3"
      bg="red-400"
      transition-all
      duration-300
      min-w="15rem"
    >
      <button
        title="Hide list"
        md="hidden"
        w="full"
        flex
        justify="start"
        items="center"
        gap="3"
        bg="red-400"
        px="3"
        @click="emit('update:isOpened', !props.isOpened)"
      >
        <icon-pkmn-arrows-right h="8" />
        <span>Hide list</span>
      </button>

      <PokemonList @item-click="onItemClick" />
    </nav>
  </transition>
</template>

<style scoped lang="scss">
.router-link-exact-active {
  --at-apply: 'bg-red-500';
}

.v-enter-active,
.v-leave-active {
  --at-apply: 'transition-transform transition-duration-300';
}

.v-enter-from,
.v-leave-to {
  @media screen and (min-width: 640px) {
    transform: none;
  }
  transform: translateX(-100%);
}
</style>
