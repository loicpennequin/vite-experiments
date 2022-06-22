<script setup lang="ts">
const props = withDefaults(defineProps<{ is?: string }>(), {
  is: 'div'
});
</script>

<template>
  <component :is="props.is" bg="white" p="4"><slot /></component>
</template>
