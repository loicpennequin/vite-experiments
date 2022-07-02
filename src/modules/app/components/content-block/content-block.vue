<script setup lang="ts">
const props = defineProps<{ title?: string }>();
</script>

<template>
  <ContentSurface>
    <h3 v-if="title" font-bold text="2xl">{{ props.title }}</h3>

    <slot />
  </ContentSurface>
</template>
