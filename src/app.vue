<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useIsPreloading } from './modules/app/composables/use-is-preloading';

const isPreloading = useIsPreloading();
const isSidebarOpened = ref(false);

const isSSR = ref(false);
onMounted(() => {
  isSSR.value = false;
});
</script>

<template>
  <div
    class="layout"
    :class="{
      'layout--is-ssr': isSSR
    }"
    font="sans"
    bg="red-400"
    grid
    max-w="screen"
    min-h="screen"
  >
    <input
      id="sidebar-toggle"
      v-model="isSidebarOpened"
      type="checkbox"
      sr-only
    />
    <AppHeader
      sticky
      z-1
      top="0"
      col-span="full"
      @open-sidebar="isSidebarOpened = true"
    />
    <AppSidebar
      v-model:is-opened="isSidebarOpened"
      class="layout__sidebar"
      overflow-y-auto
      top="lt-sm:0"
      h="lt-sm:screen"
      lt-sm="fixed"
      transition-transform
      transition-duration="0 lt-sm:300"
      col-start-1
      z-2
    />

    <main
      bg="blue-1"
      col-start="2 lt-sm:1"
      col-span="1"
      :overflow-x="isSidebarOpened && 'lt-sm:hidden'"
    >
      <LoadingSpinner v-if="isPreloading" absolute top="5" right="5" />
      <div
        class="layout__page-wrapper"
        :translate-x="isSidebarOpened ? 'lt-sm:15rem' : 0"
        p="y-8 x-2"
        flex
        justify-center
        transition-transform
        transition-duration-300
        h-full
      >
        <router-view />
      </div>
    </main>
  </div>
</template>

<style lang="scss" scoped>
.layout {
  grid-template-columns: auto minmax(0, 1fr);
  grid-template-rows: 56px 1fr;

  @media screen and (max-width: 640px) {
    grid-template-columns: minmax(0, 1fr);
  }
}

.layout__sidebar {
  height: 100vh;

  @media screen and (min-width: 640px) {
    height: calc(100vh - 56px);
  }
}

#sidebar-toggle {
  &:not(:checked) ~ .layout__sidebar {
    transform: translateX(-100%);
  }

  &:checked ~ .layout__sidebar {
    transform: none;
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
