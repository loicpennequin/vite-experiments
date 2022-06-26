<script lang="ts" setup>
import { useLoader } from '../../composables/use-loader';

const queries = useLoader();
</script>

<template>
  <div>
    <h3>Bar</h3>
    {{ Object.keys(queries) }}
  </div>
</template>
