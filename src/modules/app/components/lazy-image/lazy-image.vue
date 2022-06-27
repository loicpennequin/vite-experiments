<script lang="ts">
export default { inheritAttrs: false };
</script>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';

const image = ref<HTMLImageElement>();
const isLoaded = ref(true);
const props = defineProps<{ src: string; alt: string }>();

const onLoad = () => {
  isLoaded.value = true;
};

onMounted(() => {
  if (!image.value?.complete) {
    isLoaded.value = false;
  }
});
</script>

<template>
  <div grid place-items-center>
    <LoadingSpinner
      v-if="!isLoaded"
      col-start="1"
      row-start="1"
      w="12"
      h="12"
    />

    <img
      ref="image"
      :src="props.src"
      :alt="props.alt"
      :opacity="isLoaded ? 1000 : 0"
      transition-opacity
      duration-200
      col-start="1"
      row-start="1"
      v-bind="$attrs"
      @load="onLoad"
    />
  </div>
</template>

<style lang="scss" scoped>
img.--is-loading {
  visibility: hidden;
}
</style>
