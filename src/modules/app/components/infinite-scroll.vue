<script setup lang="ts">
import { onBeforeUnmount, ref, unref, computed, watch } from 'vue';

const props = withDefaults(
  defineProps<{
    buffer?: number;
    root?: HTMLElement | null;
  }>(),
  { isEnabled: true, buffer: 350, root: null }
);
const emit = defineEmits<{
  (e: 'loadMore'): void;
}>();

const observer = ref<IntersectionObserver>();
const trigger = ref<HTMLDivElement>();

const onIntersect: IntersectionObserverCallback = entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      emit('loadMore');
    }
  });
};

const root = computed(() => {
  if (import.meta.env.SSR) return null;

  return unref(props.root) || document;
});

const initObserver = () => {
  if (!trigger.value) return;
  const rootElement = unref(root);
  if (!rootElement) return;

  observer.value = new IntersectionObserver(onIntersect, {
    root: rootElement,
    rootMargin: `${props.buffer}px`
  });

  cleanup(rootElement);
  observer.value.observe(trigger.value);
};

const cleanup = (root: HTMLElement | Document) => {
  root.removeEventListener('scroll', initObserver);
};

watch(
  root,
  (root, oldRoot) => {
    if (oldRoot) cleanup(oldRoot);
    if (!root) return;

    unref(root).addEventListener('scroll', initObserver);
  },
  { immediate: true }
);

onBeforeUnmount(() => root.value && cleanup(root.value));
</script>

<template>
  <slot />
  <div ref="trigger" class="infinite-scroll-trigger" />
</template>

<style lang="scss" scoped>
.infinite-scroll-trigger {
  height: 2px;
}
</style>
