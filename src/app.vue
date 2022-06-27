<script lang="ts" setup>
import { useIsPreloading } from './composables/use-is-preloading';

const isPreloading = useIsPreloading();
</script>

<template>
  <div class="layout" font="sans" bg="red-400" grid max-w="screen">
    <Header sticky top="0" col-span-full />
    <!-- <div /> -->
    <Sidebar class="layout__sidebar" overflow-y-auto />

    <main flex justify-center bg="blue-1" p-y="8" p-x="2" relative>
      <Spinner v-if="isPreloading" absolute top="5" right="5" />
      <router-view />
    </main>
  </div>
</template>

<style lang="scss" scoped>
.layout {
  grid-template-columns: auto minmax(0, 1fr);
}

.layout__sidebar {
  height: calc(100vh - 56px);
}
</style>

<style lang="scss">
* {
  /* Firefox */
  scrollbar-color: #666;
  scrollbar-width: 12px;
  /* Chrome */
  ::-webkit-scrollbar {
    --at-apply: 'bg-blue-300';
    width: 10px;
    height: 10px;
    border-radius: 4px;
    overflow-x: hidden;
  }

  ::-webkit-scrollbar-thumb {
    --at-apply: 'bg-blue-400';
    border-radius: 10px;
  }
}
</style>
