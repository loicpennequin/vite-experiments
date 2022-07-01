<script lang="ts" setup>
import { ref, computed } from 'vue';
import { vUid } from '../../directives/unique-id';

const props = defineProps<{ modelValue: boolean }>();
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

const vModel = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit('update:modelValue', val);
  }
});

const inputEl = ref<HTMLInputElement>();
</script>

<template>
  <div flex items-center gap-xs text-xs>
    <input ref="inputEl" v-model="vModel" v-uid type="checkbox" sr-only />
    <slot name="off" />
    <label
      :for="inputEl?.id"
      un-after="absolute top-0  w-4 h-4 rounded-full bg-slate-600 dark:bg-slate-300 duration-200"
      border="solid 1 gray-400 dark:gray-500"
      w="10"
      h="5"
      rounded-full
      relative
      p-x="1"
      cursor-pointer
    />
    <slot name="on" />
  </div>
</template>

<style lang="scss" scoped>
label::after {
  content: '';
  margin-top: 1px;
  margin-left: 1px;
}

input[type='checkbox'] {
  &:not(:checked) {
    ~ label::after {
      left: 0;
    }
  }

  &:checked {
    ~ .default-sprite {
      opacity: 0;
    }

    ~ label::after {
      left: calc(100% - 18px);
    }
  }
}
</style>
