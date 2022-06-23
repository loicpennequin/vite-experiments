<script lang="ts" setup>
import { computed } from 'vue';
import { useLoader } from '../../composables/use-loader';

const { pokemonQuery } = useLoader();
const { isLoading, isError, data: pokemon } = pokemonQuery;

const typeLabel = computed(() =>
  pokemon.value.types?.map((t: any) => t.type.name).join(' / ')
);
</script>

<template>
  <Surface v-if="isLoading" flex items-center justify-center>Loading</Surface>
  <Surface v-if="isError" flex items-center justify-center>Error</Surface>

  <div v-else-if="pokemon" space-y="4" w="screen-sm" max-w="full">
    <Surface is="h2" text="3xl" font-bold capitalize rounded="lg">
      {{ pokemon.name }}
    </Surface>

    <Surface rounded="lg">
      <div flex items="center" flex-wrap>
        <Image :src="pokemon.sprites.front_default" />

        <ul grid grid-cols="1 lg:2  " gap="2">
          <StatBar
            v-for="stat in pokemon.stats"
            :key="stat.stat.name"
            is="li"
            :stat="stat"
          />
        </ul>
      </div>
      <div uppercase>{{ typeLabel }}</div>
    </Surface>

    <Surface rounded="lg">
      <div p="3">{{ pokemon.description }}</div>
    </Surface>
  </div>
</template>

<style scoped lang="scss">
.stat-bar {
  background-color: hsl(var(--hue), 80%, 60%);
  width: var(--width);
  transition: all 0.5s;
}
</style>
