<script lang="ts" setup>
import { computed } from 'vue';
import { STATS } from '@/constants';
import { PokemonStat } from '../../models/pokemon.resource';

const props = withDefaults(defineProps<{ is?: string; stat: PokemonStat }>(), {
  is: 'div'
});

const label = computed(() => {
  const name = props.stat.name as keyof typeof STATS;

  return STATS[name];
});

const hue = computed(() => (props.stat.baseStat * 120) / 200);

const width = computed(() => (props.stat.baseStat * 100) / 200 + '%');
</script>

<template>
  <component :is="props.is" flex gap="2" w="13rem">
    <span w="7ch">{{ label }}</span>
    <div flex-grow="1" class="stat-bar" pl="1" transition-all duration-500>
      {{ props.stat.baseStat }}
    </div>
  </component>
</template>

<style scoped>
.stat-bar {
  background-color: hsl(v-bind(hue), 80%, 60%);
  min-width: v-bind(width);
}
</style>
