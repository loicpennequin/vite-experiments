<script lang="ts" setup>
import { ref } from 'vue';
import { Pokemon } from '../../models/pokemon.resource';
import { vUid } from '@/modules/app/directives/unique-id';

const props = defineProps<{ pokemon: Pokemon }>();
const input = ref<HTMLInputElement>();
const isToggled = ref(false);
const isSSR = import.meta.env.SSR;
</script>

<template>
  <div grid justify-center>
    <input ref="input" v-model="isToggled" v-uid type="checkbox" sr-only />
    <div col-start-1 row-start-1 class="default-sprite">
      <LazyImage
        :src="props.pokemon.sprites.default"
        :alt="`${pokemon.name}`"
      />
    </div>
    <div col-start-1 row-start-1 class="shiny-sprite">
      <LazyImage
        :src="props.pokemon.sprites.shiny"
        :alt="`${pokemon.name} shiny`"
      />
    </div>

    <div
      flex
      items-center
      gap-xs
      text-xs
      class="label__wrapper"
      :invisible="isSSR"
    >
      Normal
      <label
        :for="input?.id"
        border="solid 1 gray-400"
        w="10"
        h="5"
        rounded-full
        relative
        p-x="1"
        cursor-pointer
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
  --at-apply: 'absolute top-0  w-4 h-4 rounded-full bg-blue-400 duration-200';
  content: '';
  margin-top: 1px;
  margin-left: 1px;
}

.default-sprite,
.shiny-sprite {
  --at-apply: 'transition-opacity duration-300';
}
</style>
