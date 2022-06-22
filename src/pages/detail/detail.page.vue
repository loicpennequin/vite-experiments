<script lang="ts" setup>
import { computed } from 'vue';
import { useLoader } from '../../composables/use-loader';
import { STATS } from '../../constants';

const { pokemonQuery } = useLoader();
const { isLoading, isError, data: pokemon } = pokemonQuery;

const getLabel = (stat: any) => {
  const name: keyof typeof STATS = stat.stat.name;

  return STATS[name];
};

const getStatStyle = (stat: any) => {
  return {
    '--width': (stat.base_stat * 100) / 200 + '%',
    '--hue': (stat.base_stat * 120) / 200
  };
};

const typeLabel = computed(() =>
  pokemon.value.types?.map((t: any) => t.type.name).join(' / ')
);
</script>

<template>
  <div v-if="isLoading">Loading</div>
  <div v-if="isError">An error as occured.</div>
  <div v-else-if="pokemon">
    <h2 text="3xl" font-bold capitalize>{{ pokemon.name }}</h2>

    <div flex items="center">
      <Image :src="pokemon.sprites.front_default" />

      <ul grid grid-cols="2" gap="2">
        <StatBar
          v-for="stat in pokemon.stats"
          :key="stat.stat.name"
          is="li"
          :stat="stat"
        />
      </ul>
    </div>

    <div uppercase>{{ typeLabel }}</div>
  </div>
</template>

<style scoped lang="scss">
.stat-bar {
  background-color: hsl(var(--hue), 80%, 60%);
  width: var(--width);
  transition: all 0.5s;
}
</style>
