<script lang="ts" setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { Pokemon } from '../../models/pokemon.resource';

const props = defineProps<{ pokemon: Pokemon }>();

const { t } = useI18n();
const isToggled = ref(false);
</script>

<template>
  <div grid justify-items-center>
    <transition-group>
      <PokemonSprite
        v-if="!isToggled"
        key="default"
        :alt="props.pokemon.name"
        col-start-1
        row-start-1
        :sprite="props.pokemon.sprites.default"
        w="25"
      />

      <PokemonSprite
        v-else
        key="shiny"
        :alt="t('shinyAlt', { name: props.pokemon.name })"
        col-start-1
        row-start-1
        :sprite="props.pokemon.sprites.shiny"
        w="25"
      />
    </transition-group>

    <JsRequired>
      <SwitchInput v-model="isToggled">
        <template #off>{{ t('labels.normal') }}</template>
        <template #on>{{ t('labels.shiny') }}</template>
      </SwitchInput>
    </JsRequired>
  </div>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  --at-apply: 'transition-opacity duration-300';
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
<i18n lang="json">
{
  "en": {
    "shinyAlt": "{name} shiny",
    "labels": {
      "normal": "Normal",
      "shiny": "Shiny"
    }
  }
}
</i18n>
