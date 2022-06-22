<script setup lang="ts"></script>

<template>
  <header>
    <h1>
      <router-link :to="{ name: 'Home' }">Pokédex</router-link>
    </h1>
  </header>
</template>

<style lang="scss">
header {
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 1rem;
  border-bottom: var(--separator);

  > h1 {
    margin: 0;
  }
}
</style>
