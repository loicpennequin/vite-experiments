<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<template>
  <header
    flex
    items="center"
    justify="space-between"
    p="2"
    bg="red-400"
    shadow="md"
  >
    <AppSidebarToggle p="4" :title="t('toggle')">
      <icon-pkmn-bars h="8" />
    </AppSidebarToggle>
    <h1 m="0" text="2xl">
      <AppLink :to="{ name: 'Home' }">Pokédex</AppLink>
    </h1>
  </header>
</template>

<i18n lang="json">
{
  "en": {
    "toggle": "Open menu"
  }
}
</i18n>
