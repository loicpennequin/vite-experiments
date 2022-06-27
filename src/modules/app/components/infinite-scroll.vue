<script setup lang="ts">
import {
  onMounted,
  onBeforeUnmount,
  ref,
  unref,
  computed,
  nextTick
} from 'vue';

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
  cleanup();
  observer.value.observe(trigger.value);
};

const cleanup = () => {
  unref(root).removeEventListener('scroll', initObserver);
};

onMounted(() => {
  nextTick(() => {
    unref(root).addEventListener('scroll', initObserver, { passive: true });
  });
});

onBeforeUnmount(cleanup);
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
