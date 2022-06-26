<script lang="ts" setup>
import { useLoader } from '../../composables/use-loader';

const queries = useLoader();
</script>

<template>
  <Surface
    flex
    flex-col
    items="center"
    justify="center"
    h-full
    min-w="40rem"
    gap="5"
  >
    <h2>Foo page</h2>
    {{ Object.keys(queries) }}
    <div border="solid ref-600 3" p="5">
      <router-view />
    </div>
  </Surface>
</template>
