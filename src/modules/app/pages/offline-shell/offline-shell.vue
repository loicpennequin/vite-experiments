<script lang="ts" setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const { replace } = useRouter();
onMounted(() => {
  replace({ name: 'Home' });
});
</script>
<template>
  <div v-if="false" />
</template>

<route lang="json">
{ "name": "OfflineShell", "path": "/offline-shell" }
</route>
