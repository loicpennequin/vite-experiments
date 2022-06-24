<template>
  <header
    flex
    items="center"
    justify-between
    p="x-6 y-3"
    bg="red-400"
    shadow="md"
  >
    <h1 m="0" text="2xl">
      <Link :to="{ name: 'Home' }">Pokédex</Link>
    </h1>
  </header>
</template>
