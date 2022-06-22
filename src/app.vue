<script setup lang="ts">
import { provide } from 'vue';
import { loaders } from './factories/loader.factory';
import { useRouter } from 'vue-router';
import Sidebar from './components/sidebar.vue';

provide('loaders', loaders);

const router = useRouter();
router.beforeEach((to, from, next) => {
  if (!to.name) return next();

  loaders.get(to.name)?.preload(to);

  next();
});
</script>

<template>
  <div class="layout">
    <header>
      <h1>
        <router-link :to="{ name: 'Home' }">Pokédex</router-link>
      </h1>
    </header>

    <Sidebar class="layout__sidebar" />

    <main>
      <router-view />
    </main>
  </div>
</template>

<style lang="scss">
:root {
  --separator: solid 1px #ccc;
}

body {
  margin: 0;
  font-family: Helvetica;

  a {
    text-decoration: none;
    color: inherit;
  }
}

* {
  box-sizing: border-box;
}

.layout {
  --header-height: 50px;
  display: grid;
  grid-template-columns: 200px 3fr;
  grid-template-rows: var(--header-height) 1fr;
  grid-column-gap: 1rem;

  > header {
    grid-column: 1 / -1;
    position: sticky;
    top: 0;
    background-color: white;
    display: flex;
    align-items: center;
    padding-left: 1rem;
    border-bottom: var(--separator);

    > h1 {
      margin: 0;
    }
  }
}

.layout__sidebar {
  border-right: var(--separator);
  height: calc(100vh - var(--header-height));
  overflow-y: auto;
}
</style>
