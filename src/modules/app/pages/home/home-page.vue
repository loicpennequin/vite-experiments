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
  <div max-w="full" space-y="4" w="screen-sm">
    <ContentSurface
      flex
      flex-col
      gap="5"
      items="center"
      justify="center"
      p-y="15"
      text-center
    >
      <p text="3xl">{{ t('title') }}</p>

      <p text="xl">{{ t('subtitle') }}</p>
    </ContentSurface>

    <ContentSurface space-y="3">
      <h2 lt-sm="text-center" text="2xl" weight-bold>{{ t('potd.title') }}</h2>
      <div mx="auto" space-y="5">
        <figure capitalize flex gap="3" lt-sm="flex-wrap">
          <div m-x="auto" w="sm:full">
            <div
              v-if="isLoading"
              animate-pulse
              aspect-square
              bg="light-300 dark:dark-300"
              w="35"
            />
            <LazyImage
              v-else-if="pokemonOfTheDay"
              :alt="pokemonOfTheDay.name"
              aspect-square
              bg="light-300 dark:dark-300"
              :src="pokemonOfTheDay.sprites.default"
              w="35"
            />
          </div>

          <figcaption v-if="pokemonOfTheDay" max-w="40ch">
            <div lt-sm="text-center" text="xl">
              {{ pokemonOfTheDay.name }}
            </div>
            <p>{{ pokemonOfTheDay.description }}</p>

            <AppLink
              flex
              float-right
              gap="4"
              items-center
              prefetch
              :to="{ name: 'Detail', params: { name: pokemonOfTheDay.name } }"
              underline
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
