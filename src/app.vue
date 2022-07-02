<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useIsPreloading } from './modules/app/composables/use-is-preloading';
import { vClickOutside } from './modules/app/directives/click-outside';

const isPreloading = useIsPreloading();
const isSidebarOpened = ref(false);

const isSSR = ref(false);
onMounted(() => {
  isSSR.value = false;
});

const onClickOutside = () => {
  isSidebarOpened.value = false;
};
</script>

<template>
  <div
    class="layout"
    :class="{
      'layout--is-ssr': isSSR
    }"
    font="sans"
    bg="light-400 dark:dark-300"
    color="black dark:white"
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
    <AppHeader sticky z-1 top="0" col-span="full" />
    <AppSidebar
      v-model:is-opened="isSidebarOpened"
      v-click-outside="onClickOutside"
      class="layout__sidebar"
      top="lt-sm:0"
      h="lt-sm:screen"
      lt-sm="fixed"
      transition-transform
      transition-duration="0 lt-sm:300"
      col-start-1
      z="lt-sm:2"
    />

    <main
      col-start="2 lt-sm:1"
      col-span="1"
      relative
      :overflow-x="isSidebarOpened && 'lt-sm:hidden'"
    >
      <LoadingSpinner v-if="isPreloading" absolute top="5" right="5" />
      <div
        class="layout__page-wrapper"
        :translate-x="isSidebarOpened ? 'lt-sm:15rem' : 0"
        p="y-8 x-2"
        flex
        flex-col
        items-center
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
  @media screen and (max-width: 640px) {
    &:not(:checked) ~ .layout__sidebar {
      transform: translateX(-100%);
    }

    &:checked ~ .layout__sidebar {
      transform: none;
    }
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
    --at-apply: 'bg-slate-300 dark-bg-slate-600';
    width: 10px;
    height: 10px;
    border-radius: 4px;
    overflow-x: hidden;
  }

  ::-webkit-scrollbar-thumb {
    --at-apply: 'bg-slate-600 dark-bg-slate-300';
    border-radius: 10px;
  }
}
</style>
