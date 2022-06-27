<script lang="ts" setup>
import { useIsPreloading } from './modules/app/composables/use-is-preloading';

const isPreloading = useIsPreloading();
</script>

<template>
  <div class="layout" font="sans" bg="red-400" grid max-w="screen">
    <AppHeader sticky top="0" col-span="full" row-start-1 row-span-1 />
    <!-- <div /> -->
    <AppSidebar
      class="layout__sidebar"
      overflow-y-auto
      row-span="lt-sm:full"
      col-start-1
      z-1
    />

    <main
      flex
      justify-center
      bg="blue-1"
      p="y-8 x-2"
      relative
      row-start="2"
      col-start="2 lt-sm:1"
      col-span="1 lt-sm:full"
    >
      <LoadingSpinner v-if="isPreloading" absolute top="5" right="5" />
      <router-view />
    </main>
  </div>
</template>

<style lang="scss" scoped>
.layout {
  grid-template-columns: auto minmax(0, 1fr);
  grid-template-rows: 56px 1fr;
}

.layout__sidebar {
  height: 100vh;

  @media screen and (min-width: 640px) {
    height: calc(100vh - 56px);
  }
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
