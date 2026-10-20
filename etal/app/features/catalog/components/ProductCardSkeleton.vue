<template>
  <div class="flex flex-col gap-3.5" aria-hidden="true">
    <UiSkeleton class="aspect-4/5" />
    <div class="flex flex-col gap-2">
      <UiSkeleton class="h-3 w-1/3" />
      <UiSkeleton variant="text" :lines="2" />
      <UiSkeleton class="h-4 w-1/4" />
    </div>
  </div>
</template>
