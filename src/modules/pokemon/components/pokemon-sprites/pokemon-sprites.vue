<script lang="ts" setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { Pokemon } from '../../models/pokemon.resource';

const props = defineProps<{ pokemon: Pokemon }>();

const { t } = useI18n();
const isToggled = ref(false);
const isSSR = import.meta.env.SSR;
</script>

<template>
  <div grid justify-center>
    <input
      v-model="isToggled"
      id="pokemon-sprite-toggle"
      ref="input"
      sr-only
      type="checkbox"
    />
    <div class="default-sprite" col-start-1 row-start-1>
      <LazyImage
        v-if="props.pokemon.sprites.default"
        :alt="`${pokemon.name}`"
        :src="props.pokemon.sprites.default"
      />
      <p v-else m-x="auto" text="sm" text-center w="15">
        {{ t('unavailable') }}
      </p>
    </div>

    <div class="shiny-sprite" col-start-1 row-start-1>
      <LazyImage
        v-if="props.pokemon.sprites.shiny"
        :alt="`${pokemon.name}`"
        :src="props.pokemon.sprites.shiny"
      />
      <p v-else m-x="auto" text="sm" text-center w="15">
        {{ t('unavailable') }}
      </p>
    </div>

    <div
      class="label__wrapper"
      flex
      gap-xs
      :invisible="isSSR"
      items-center
      text-xs
    >
      Normal
      <label
        border="solid 1 gray-400"
        cursor-pointer
        for="pokemon-sprite-toggle"
        h="5"
        p-x="1"
        relative
        rounded-full
        w="10"
      />
      Shiny
    </div>
  </div>
</template>

<style lang="scss" scoped>
input[type='checkbox'] {
  &:not(:checked) {
    ~ .shiny-sprite {
      opacity: 0;
    }

    ~ .label__wrapper label::after {
      left: 0;
    }
  }

  &:checked {
    ~ .default-sprite {
      opacity: 0;
    }

    ~ .label__wrapper label::after {
      left: calc(100% - 18px);
    }
  }
}

label::after {
  --at-apply: 'absolute top-0  w-4 h-4 rounded-full bg-slate-600 dark:bg-slate-300 duration-200';
  content: '';
  margin-top: 1px;
  margin-left: 1px;
}

.default-sprite,
.shiny-sprite {
  --at-apply: 'transition-opacity duration-300';
}
</style>

<i18n lang="json">
{
  "en": {
    "unavailable": "Sprite not available"
  }
}
</i18n>
