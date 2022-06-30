<script lang="ts" setup>
import { EvoltutionChain } from '../../api/pokemon.api';

const props = defineProps<{ evolutionChain: EvoltutionChain }>();
</script>

<template>
  <div grid :grid-cols="props.evolutionChain.length" gap="3">
    <div v-for="(step, index) in props.evolutionChain" :key="index">
      <AppLink
        v-for="evolution in step"
        :key="evolution.id"
        :to="{ name: 'Detail', params: { name: evolution.name } }"
      >
        <figure>
          <LazyImage :src="evolution.sprites.default" :alt="evolution.name" />
          <figcaption text-center>{{ evolution.name }}</figcaption>
        </figure>
      </AppLink>
    </div>
  </div>
</template>
