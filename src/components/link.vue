<script setup lang="ts">
import { inject } from 'vue';
import { LocationAsRelativeRaw, useRouter } from 'vue-router';

const props = withDefaults(
  defineProps<{ prefetch?: boolean; to: LocationAsRelativeRaw }>(),
  {
    prefetch: false
  }
);

const { resolve } = useRouter();
const loaders = inject('loaders', new Map());

let timeout: number;

const onMouseEnter = () => {
  if (!props.prefetch) return;
  timeout = setTimeout(() => {
    const { name } = props.to;
    if (!name) return;

    const loader = loaders.get(name);

    loader?.preload(resolve(props.to));
  }, 250);
};

const onMouseLeave = () => {
  if (!props.prefetch) return;
  clearTimeout(timeout);
};
</script>

<template>
  <router-link
    :to="props.to"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <slot />
  </router-link>
</template>
