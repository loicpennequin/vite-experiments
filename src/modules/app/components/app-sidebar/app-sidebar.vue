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
  <nav p-y="3" bg="white" min-w="15rem">
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

    <PokemonList @item-click="onItemClick" />
  </nav>
</template>
