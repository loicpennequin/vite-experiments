<script lang="ts" setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useIsPreloading } from './modules/app/composables/use-is-preloading';
import { vClickOutside } from './modules/app/directives/click-outside';

const isPreloading = useIsPreloading();
const isSidebarOpened = ref(false);

const onClickOutside = () => {
  isSidebarOpened.value = false;
};

const { t } = useI18n();
</script>

<template>
  <div
    bg="light-400 dark:dark-300"
    class="layout"
    color="black dark:white"
    font="sans"
    grid
    max-w="screen"
    min-h="screen"
  >
    <input
      v-model="isSidebarOpened"
      id="sidebar-toggle"
      sr-only
      type="checkbox"
    />
    <AppHeader col-span="full" sticky top="0" z-1 />
    <a href="#main" sr-only>{{ t('skip') }}</a>
    <AppSidebar
      v-model:is-opened="isSidebarOpened"
      v-click-outside="onClickOutside"
      class="layout__sidebar"
      col-start-1
      h="lt-sm:screen"
      lt-sm="fixed"
      top="lt-sm:0"
      transition-duration="0 lt-sm:300"
      transition-transform
      z="lt-sm:2"
    />

    <main
      id="main"
      col-span="1"
      col-start="2 lt-sm:1"
      :overflow-x="isSidebarOpened && 'lt-sm:hidden'"
      relative
    >
      <LoadingSpinner v-if="isPreloading" absolute right="5" top="5" />
      <div
        class="layout__page-wrapper"
        flex
        flex-col
        h-full
        items-center
        p="y-8 x-2"
        transition-duration-300
        transition-transform
        :translate-x="isSidebarOpened ? 'lt-sm:15rem' : 0"
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

<i18n lang="json">
{
  "en": {
    "skip": "Skip to main content"
  }
}
</i18n>
