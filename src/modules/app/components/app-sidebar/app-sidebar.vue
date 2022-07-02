<script setup lang="ts">
defineProps<{ isOpened: boolean }>();
const emit = defineEmits<{
  (e: 'update:isOpened', value: boolean): void;
}>();

// onMounted(() => {
//   emit('update:isOpened', isLargeScreen.value);
// });

const onItemClick = () => {
  emit('update:isOpened', false);
};
</script>

<template>
  <nav bg="white dark:dark-100" flex flex-col min-w="15rem" shadow-md>
    <app-sidebar-toggle
      flex
      gap="3"
      items="center"
      justify="start"
      px="3"
      title="Hide list"
      w="full"
    >
      <icon-pkmn-arrows-right fill="dark:white" h="8" />
      <span>Hide list</span>
    </app-sidebar-toggle>

    <div flex="1" overflow-y-auto>
      <PokemonList @item-click="onItemClick" />
    </div>
  </nav>
</template>
