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
  <nav p-y="3" bg="red-400" min-w="15rem">
    <app-sidebar-toggle
      title="Hide list"
      md="hidden"
      w="full"
      flex
      justify="start"
      items="center"
      gap="3"
      bg="red-400"
      px="3"
    >
      <icon-pkmn-arrows-right h="8" />
      <span>Hide list</span>
    </app-sidebar-toggle>

    <PokemonList @item-click="onItemClick" />
  </nav>
</template>

<style scoped lang="scss">
.router-link-exact-active {
  --at-apply: 'bg-red-500';
}
</style>
