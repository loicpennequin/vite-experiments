<script lang="ts" setup>
import { useLoader } from '../../composables/use-loader';
import Image from '../../components/image.vue';
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
</script>

<template>
  <div v-if="isLoading">Loading</div>
  <div v-if="isError">An error as occured.</div>
  <div v-else-if="pokemon">
    <h2>{{ pokemon.name }}</h2>

    <div class="infos-wrapper">
      <Image :src="pokemon.sprites.front_default" />

      <ul>
        <li v-for="stat in pokemon.stats" :key="stat.stat.name">
          <span>{{ getLabel(stat) }}</span>
          <div>{{ stat.base_stat }}</div>
          <div class="stat-bar" :style="getStatStyle(stat)" />
        </li>
      </ul>
    </div>

    <pre>{{ pokemon.types }}</pre>
  </div>
</template>

<style scoped lang="scss">
h2 {
  text-transform: capitalize;
}

.infos-wrapper {
  display: flex;
  align-items: center;

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
  }

  li {
    display: grid;
    grid-template-columns: 7ch auto 100px;
    grid-gap: 0.5rem;
  }

  .stat-bar {
    flex-grow: 1;
    display: flex;
    align-items: center;
    background-color: hsl(var(--hue), 80%, 60%);
    width: var(--width);
    transition: all 0.5s;
  }
}
</style>
