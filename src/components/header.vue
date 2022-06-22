<template>
  <header flex items="center" p="3" bg="red-400" shadow="lg">
    <h1 un-m="0" text="2xl">
      <Link :to="{ name: 'Home' }">Pokédex</Link>
    </h1>
  </header>
</template>

<style lang="scss">
header {
  border-bottom: var(--separator);

  > h1 {
    margin: 0;
  }
}
</style>
