<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();
</script>
<template>
  <header
    flex
    items="center"
    justify="space-between"
    p="x-6 y-3"
    pl="lt-sm:12"
    bg="red-400"
    shadow="md"
    gap="8"
  >
    <h1 m="0" text="2xl">
      <Link :to="{ name: 'Home' }">Pokédex</Link>
    </h1>
  </header>
</template>
