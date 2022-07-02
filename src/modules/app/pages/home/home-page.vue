<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { useLoader } from '../../composables/use-loader';
import { HomeLoader } from './home.loader';

const { t } = useI18n();

const {
  pokemonOfTheDay: { isLoading, data: pokemonOfTheDay }
} = useLoader<HomeLoader>();
</script>

<template>
  <div space-y="4" w="screen-sm" max-w="full">
    <ContentSurface
      flex
      flex-col
      items="center"
      justify="center"
      gap="5"
      p-y="15"
      text-center
    >
      <p text="3xl">{{ t('title') }}</p>

      <p text="xl">{{ t('subtitle') }}</p>
    </ContentSurface>

    <ContentSurface space-y="3">
      <h2 text="2xl" weight-bold lt-sm="text-center">{{ t('potd.title') }}</h2>
      <div mx="auto" space-y="5">
        <figure capitalize flex gap="3" lt-sm="flex-wrap">
          <div m-x="auto" w="sm:full">
            <div
              v-if="isLoading"
              w="35"
              aspect-square
              bg="light-300 dark:dark-300"
              animate-pulse
            />
            <LazyImage
              v-else-if="pokemonOfTheDay"
              :src="pokemonOfTheDay.sprites.default"
              :alt="pokemonOfTheDay.name"
              w="35"
              aspect-square
              bg="light-300 dark:dark-300"
            />
          </div>

          <figcaption v-if="pokemonOfTheDay" max-w="40ch">
            <div text="xl" lt-sm="text-center">
              {{ pokemonOfTheDay.name }}
            </div>
            <p>{{ pokemonOfTheDay.description }}</p>

            <AppLink
              :to="{ name: 'Detail', params: { name: pokemonOfTheDay.name } }"
              prefetch
              underline
              float-right
              gap="4"
              flex
              items-center
            >
              See more
              <icon-pkmn-chevron-right />
            </AppLink>
          </figcaption>
        </figure>
      </div>
    </ContentSurface>
  </div>
</template>

<i18n lang="json">
{
  "en": {
    "title": "Welcome to the online Pokédex !",
    "subtitle": "Click on a pokemon in the sidebar to see its detail.",
    "potd": {
      "title": "Pokémon of the day"
    }
  }
}
</i18n>

<route lang="json">
{
  "path": "/",
  "name": "Home"
}
</route>
