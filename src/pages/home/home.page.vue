<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<template>
  <Surface
    flex
    flex-col
    items="center"
    justify="center"
    h-full
    min-w="at-sm:40rem"
    gap="5"
    text-center
  >
    <p text="3xl">{{ t('title') }}</p>

    <p text="xl">{{ t('subtitle') }}</p>
  </Surface>
</template>

<i18n lang="json">
{
  "en": {
    "title": "Welcome to the online Pokédex !",
    "subtitle": "Click on a pokemon in the sidebar to see its detail."
  }
}
</i18n>

<route lang="json">
{
  "path": "/",
  "name": "Home"
}
</route>
