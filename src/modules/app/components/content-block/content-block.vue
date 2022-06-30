<script setup lang="ts">
const props = defineProps<{ title?: string }>();
</script>

<template>
  <ContentSurface>
    <h3 v-if="title" text="2xl" font-bold>{{ props.title }}</h3>

    <slot />
  </ContentSurface>
</template>
