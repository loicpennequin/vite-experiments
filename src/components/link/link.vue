<script setup lang="ts">
import { inject } from 'vue';
import { LocationAsRelativeRaw, useRouter } from 'vue-router';

const props = withDefaults(
  defineProps<{ prefetch?: boolean | number; to: LocationAsRelativeRaw }>(),
  {
    prefetch: false
  }
);

const { resolve } = useRouter();
const loaders = inject('loaders', new Map());

let timeout: ReturnType<typeof setTimeout>;

const onMouseEnter = () => {
  if (!props.prefetch) return;
  const duration = typeof props.prefetch === 'number' ? props.prefetch : 200;

  timeout = setTimeout(() => {
    const { name } = props.to;
    if (!name) return;

    const loader = loaders.get(name);
    loader?.preload(resolve(props.to));
  }, duration);
};

const onMouseLeave = () => {
  if (!props.prefetch) return;
  clearTimeout(timeout);
};
</script>

<template>
  <router-link
    :to="props.to"
    no-underline
    color="inherit"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <slot />
  </router-link>
</template>
