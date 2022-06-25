<script lang="ts" setup>
import { computed } from 'vue';
import { STATS } from '../constants';

const props = withDefaults(defineProps<{ is?: string; stat: any }>(), {
  is: 'div'
});

const label = computed(() => {
  const name: keyof typeof STATS = props.stat.stat.name;

  return STATS[name];
});

const hue = computed(() => (props.stat.base_stat * 120) / 200);
const width = computed(() => (props.stat.base_stat * 100) / 200 + '%');
</script>

<template>
  <component :is="props.is" flex gap="2" w="13rem">
    <span w="7ch">{{ label }}</span>
    <div flex-grow="1" class="stat-bar" pl="1" transition-all duration-500>
      {{ props.stat.base_stat }}
    </div>
  </component>
</template>

<style scoped>
.stat-bar {
  background-color: hsl(v-bind(hue), 80%, 60%);
  min-width: v-bind(width);
}
</style>
