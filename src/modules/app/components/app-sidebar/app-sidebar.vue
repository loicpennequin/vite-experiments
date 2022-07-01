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
  <nav p-y="3" bg="white dark:dark-100" min-w="15rem" flex flex-col shadow-md>
    <app-sidebar-toggle
      title="Hide list"
      w="full"
      flex
      justify="start"
      items="center"
      gap="3"
      px="3"
    >
      <icon-pkmn-arrows-right h="8" />
      <span>Hide list</span>
    </app-sidebar-toggle>

    <div flex="1" overflow-y-auto>
      <PokemonList @item-click="onItemClick" />
    </div>
  </nav>
</template>
