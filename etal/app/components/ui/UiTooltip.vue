<script setup lang="ts">
import {
  TooltipArrow,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
} from 'reka-ui'

/** Ink tooltip with ivory text (CDC graphique §11.5). Never the only carrier of information. */
withDefaults(defineProps<{ text: string; side?: 'top' | 'bottom' | 'left' | 'right' }>(), { side: 'top' })
</script>

<template>
  <TooltipProvider :delay-duration="300">
    <TooltipRoot>
      <TooltipTrigger as-child>
        <slot />
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent
          :side="side"
          :side-offset="6"
          class="z-95 max-w-xs rounded-md bg-inverse px-2.5 py-1.5 text-meta text-inverse-foreground shadow-md"
        >
          {{ text }}
          <TooltipArrow class="fill-inverse" :width="10" :height="5" />
        </TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  </TooltipProvider>
</template>
