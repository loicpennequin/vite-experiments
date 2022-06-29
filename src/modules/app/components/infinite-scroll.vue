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

const root = computed(() => unref(props.root) || document);

const initObserver = () => {
  if (!trigger.value) return;

  observer.value = new IntersectionObserver(onIntersect, {
    root: unref(root),
    rootMargin: `${props.buffer}px`
  });

  cleanup(unref(root));
  observer.value.observe(trigger.value);
};

const cleanup = (root: HTMLElement | Document) => {
  root.removeEventListener('scroll', initObserver);
};

watch(
  root,
  (root, oldRoot) => {
    if (oldRoot) cleanup(oldRoot);
    unref(root).addEventListener('scroll', initObserver);
  },
  { immediate: true }
);

onBeforeUnmount(() => cleanup(root.value));
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
