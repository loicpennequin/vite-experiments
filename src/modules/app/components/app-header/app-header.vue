<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMediaQuery } from '@vueuse/core';

const { t } = useI18n();

const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

const COLOR_MODE_KEY = 'color-mode';
const isDarkMode = computed({
  get() {
    const persistedColorPreference = import.meta.env.SSR
      ? false
      : localStorage.getItem(COLOR_MODE_KEY);
    const hasPersistedPreference = typeof persistedColorPreference === 'string';

    if (hasPersistedPreference) {
      return persistedColorPreference === 'dark';
    }

    const hasMediaQueryPreference = typeof prefersDarkMode.value === 'boolean';
    if (hasMediaQueryPreference) {
      return prefersDarkMode.value;
    }
    return false;
  },
  set(val) {
    const colorMode = val ? 'dark' : 'light';
    localStorage.setItem(COLOR_MODE_KEY, colorMode);
    document.body.classList.add('color-mode--animating');
    document.body.classList.toggle('dark');
    document.body.classList.toggle('light');
    function cleanup() {
      document.body.classList.remove('color-mode--animating');
      document.body.removeEventListener('transitionend', cleanup);
    }
    document.body.addEventListener('transitionend', cleanup);
  }
});
</script>

<template>
  <header
    bg="white dark:dark-100"
    flex
    items="center"
    justify="between"
    p="2"
    px="sm:10"
    shadow="md"
  >
    <AppSidebarToggle color-dark-400 p="4" :title="t('toggle')">
      <icon-pkmn-bars fill="dark:white" h="8" />
    </AppSidebarToggle>
    <h1 m="0" text="2xl">
      <AppLink :to="{ name: 'Home' }">Pokédex</AppLink>
    </h1>
    <ClientOnly>
      <SwitchInput v-model="isDarkMode">
        <template #off><icon-pkmn-sun fill="dark:white" /></template>
        <template #on><icon-pkmn-moon fill="dark:white" /></template>
      </SwitchInput>

      <template #fallback><div /></template>
    </ClientOnly>
  </header>
</template>

<style lang="scss">
body.color-mode--animating {
  --at-apply: 'transition-colors duration-300';
  * {
    --at-apply: 'transition-colors duration-300';
  }
}
</style>

<i18n lang="json">
{
  "en": {
    "toggle": "Open menu"
  }
}
</i18n>
