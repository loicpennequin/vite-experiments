<script lang="ts" setup>
import { ref, onMounted } from 'vue';
const isHidden = ref(true);

onMounted(() => {
  isHidden.value = false;
});
</script>
>
<template>
  <div :class="isHidden && 'invisible'"><slot v-if="isHidden" /></div>
</template>
