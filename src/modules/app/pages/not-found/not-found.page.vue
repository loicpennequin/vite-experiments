<template>
  <ContentBlock
    flex
    h-full
    items-center
    justify-center
    max-w="full"
    w="screen-sm"
  >
    404 Not found
  </ContentBlock>
</template>

<route lang="json">
{
  "path": "/:pathMatch(.*)*",
  "name": "NotFound"
}
</route>
