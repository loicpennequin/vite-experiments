<script lang="ts" setup>
import { ref, watch } from 'vue';

const isLoaded = ref(false);
const props = defineProps<{ src: string; alt: string }>();

watch(
  () => props.src,
  () => {
    console.log('reset');
    isLoaded.value = false;
  }
);

const onLoad = () => {
  console.log('loaded');
  isLoaded.value = true;
};
</script>

<template>
  <img
    :src="props.src"
    :alt="props.alt"
    :class="!isLoaded && '--is-loading'"
    @load="onLoad"
  />
</template>

<style lang="scss" scoped>
img.--is-loading {
  visibility: hidden;
}
</style>
