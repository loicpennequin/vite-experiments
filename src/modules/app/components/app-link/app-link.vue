<script setup lang="ts">
import { inject } from 'vue';
import { LocationAsRelativeRaw, useRouter } from 'vue-router';
import { LOADERS_INJECTION_KEY } from '@/constants';

const props = withDefaults(
  defineProps<{ prefetch?: boolean | number; to: LocationAsRelativeRaw }>(),
  {
    prefetch: false
  }
);

const { resolve } = useRouter();
const loaders = inject(LOADERS_INJECTION_KEY, new Map());

let timeout: ReturnType<typeof setTimeout>;

const preloadData = () => {
  resolve(props.to).matched.forEach(match => {
    loaders.get(match.name).preload(resolve(props.to));
  });
};

const preloadAssets = () => {
  resolve(props.to).matched.forEach(match => {
    Object.values(match.components).forEach(fn => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      typeof fn === 'function' && fn();
    });
  });
};

const onMouseEnter = () => {
  if (props.prefetch === false) return;

  const duration = typeof props.prefetch === 'number' ? props.prefetch : 250;
  timeout = setTimeout(() => {
    preloadData();
    preloadAssets();
  }, duration);
};

const onMouseLeave = () => {
  if (!props.prefetch) return;
  clearTimeout(timeout);
};
</script>

<template>
  <router-link
    color="inherit"
    :to="props.to"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <slot />
  </router-link>
</template>
