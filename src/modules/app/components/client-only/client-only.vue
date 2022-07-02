<script lang="ts" setup>
import { ref, onMounted } from 'vue';
const isDisplayed = ref(false);

onMounted(() => {
  isDisplayed.value = true;
});
</script>

<template>
  <slot v-if="isDisplayed" />
  <slot v-else name="fallback" />
</template>
