<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();
</script>
<template>
  <header
    flex
    items="center"
    p="x-6 y-3"
    lt-sm:pl="12"
    bg="red-400"
    shadow="md"
    gap="8"
  >
    <h1 m="0" text="2xl">
      <Link :to="{ name: 'Home' }">Pokédex</Link>
    </h1>
    <router-link to="/foo">Foo</router-link>
    <router-link to="/foo/bar">Bar</router-link>
    <div>{{ route.name }}</div>
  </header>
</template>
