<script lang="ts" setup>
import { ref, watch } from 'vue';

const isLoaded = ref(false);
const props = defineProps<{ src: string }>();
watch(
  () => props.src,
  () => {
    isLoaded.value = false;
  }
);
</script>

<template>
  <img
    :src="props.src"
    :class="!isLoaded && '--is-loading'"
    @load="isLoaded = true"
  />
</template>

<style lang="scss" scoped>
img.--isloading {
  visibility: hidden;
}
</style>
