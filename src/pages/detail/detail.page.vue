<script lang="ts" setup>
import { computed } from 'vue';
import { useLoader } from '../../composables/use-loader';

const { pokemonQuery, evolutionChainQuery } = useLoader();
const { isLoading, data: pokemon } = pokemonQuery;
const { data: evolutionChain } = evolutionChainQuery;

const typeLabel = computed(() =>
  pokemon.value.types?.map((t: any) => t.type.name).join(' / ')
);
</script>

<template>
  <div space-y="4" w="screen-sm" max-w="full">
    <template v-if="isLoading">
      <Surface h="17" animate-pulse />
      <Surface h="9.5rem" animate-pulse />
      <Surface h="26" animate-pulse />
    </template>

    <template v-else-if="pokemon">
      <Surface is="h2" text="3xl" font-bold capitalize rounded="lg">
        {{ pokemon.name }}
      </Surface>

      <Surface rounded="lg">
        <div flex items="center" flex-wrap>
          <Image :src="pokemon.sprites.front_default" :alt="pokemon.name" />

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

      <Surface rounded="lg" v-if="evolutionChain" flex gap="3">
        <div v-for="(step, index) in evolutionChain" :key="index">
          <div v-for="pokemon in step" :key="pokemon.id">
            {{ pokemon.name }}
          </div>
        </div>
      </Surface>
    </template>
  </div>
</template>

<style scoped lang="scss">
.stat-bar {
  background-color: hsl(var(--hue), 80%, 60%);
  width: var(--width);
  transition: all 0.5s;
}
</style>
