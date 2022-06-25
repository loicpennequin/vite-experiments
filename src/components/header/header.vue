<template>
  <header
    flex
    items="center"
    p="x-6 y-3"
    lt-sm:pl="12"
    bg="red-400"
    shadow="md"
  >
    <h1 m="0" text="2xl">
      <Link :to="{ name: 'Home' }">Pokédex</Link>
    </h1>
  </header>
</template>
