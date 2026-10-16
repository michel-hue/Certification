<script setup lang="ts">
import { TabsContent, TabsIndicator, TabsList, TabsRoot, TabsTrigger } from 'reka-ui'

/** Underlined tabs; the active one gets the terracotta rule (CDC graphique §11.3). */
defineProps<{ tabs: readonly { value: string; label: string }[]; label?: string }>()

const model = defineModel<string>({ required: true })
</script>

<template>
  <TabsRoot v-model="model" class="flex flex-col gap-8">
    <TabsList
      :aria-label="label"
      class="relative flex gap-8 overflow-x-auto border-b border-border [scrollbar-width:none]"
    >
      <TabsTrigger
        v-for="tab in tabs"
        :key="tab.value"
        :value="tab.value"
        class="h-13 shrink-0 cursor-pointer text-ui font-medium whitespace-nowrap text-foreground-muted transition-colors duration-150 hover:text-foreground data-[state=active]:text-foreground"
      >
        {{ tab.label }}
      </TabsTrigger>
      <TabsIndicator
        class="absolute bottom-0 left-0 h-0.5 w-(--reka-tabs-indicator-size) translate-x-(--reka-tabs-indicator-position) bg-accent transition-[width,translate] duration-250 ease-standard"
      />
    </TabsList>
    <TabsContent v-for="tab in tabs" :key="tab.value" :value="tab.value" class="outline-none">
      <slot :name="tab.value" />
    </TabsContent>
  </TabsRoot>
</template>
