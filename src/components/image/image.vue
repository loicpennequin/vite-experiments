<script lang="ts">
export default { inheritAttrs: false };
</script>

<script lang="ts" setup>
import { ref, watch } from 'vue';

const isLoaded = ref(false);
const props = defineProps<{ src: string; alt: string }>();

watch(
  () => props.src,
  () => {
    isLoaded.value = false;
  }
);

const onLoad = () => {
  isLoaded.value = true;
};
</script>

<template>
  <div grid place-items-center>
    <Spinner col-start="1" row-start="1" w="12" h="12" v-if="!isLoaded" />
    <img
      :src="props.src"
      :alt="props.alt"
      :class="!isLoaded && '--is-loading'"
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
