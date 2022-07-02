<script lang="ts" setup>
import { ref, onMounted } from 'vue';
const isHidden = ref(false);

onMounted(() => {
  isHidden.value = true;
});
</script>
>
<template>
  <div :class="isHidden && 'invisible'"><slot v-if="isHidden" /></div>
</template>
