<script setup lang="ts">
import type { NuxtError } from '#app'

/**
 * Error pages (E23 404, E24 500), inside the shop layout so the visitor keeps the header,
 * the search and the cart. Anything that is not a 404 is presented as the 500 page.
 */
const props = defineProps<{ error: NuxtError }>()

const { t } = useI18n()
const localePath = useLocalePath()
const notFound = computed(() => props.error.statusCode === 404)

const goHome = () => clearError({ redirect: localePath('/') })
const browse = () => clearError({ redirect: localePath('/products') })
const retry = () => reloadNuxtApp({ force: true })

useSeoMeta({
  title: () => (notFound.value ? t('errors.notFound.pageTitle') : t('errors.server.pageTitle')),
  robots: 'noindex, nofollow',
})
</script>

<template>
  <NuxtLayout name="default">
    <div
      v-if="notFound"
      class="mx-auto flex max-w-content flex-wrap items-center gap-12 px-gutter pt-[clamp(64px,10vw,144px)]"
    >
      <div class="flex flex-[1_1_420px] flex-col gap-6">
        <p
          class="font-serif text-[clamp(5rem,3rem+10vw,11rem)] leading-[0.85] text-accent tabular-nums"
          aria-hidden="true"
        >
          {{ error.statusCode }}
        </p>
        <h1 class="text-[clamp(2rem,1.5rem+2.4vw,3.25rem)] leading-[1.08] font-normal text-balance">
          {{ t('errors.notFound.titleStart') }} <em>{{ t('errors.notFound.titleEmphasis') }}</em>
        </h1>
        <p class="max-w-[30em] text-[18px] text-foreground-muted">{{ t('errors.notFound.text') }}</p>
        <div class="flex flex-wrap gap-4">
          <UiButton size="lg" @click="goHome">{{ t('errors.home') }}</UiButton>
          <UiButton size="lg" variant="secondary" @click="browse">{{ t('errors.notFound.browse') }}</UiButton>
        </div>
      </div>
      <!-- Empty market table, one terracotta crate: the mockup's line illustration. -->
      <svg
        class="aspect-4/3 flex-[1_1_320px] text-foreground"
        viewBox="0 0 400 300"
        fill="none"
        aria-hidden="true"
      >
        <rect x="236" y="128" width="72" height="44" rx="2" class="fill-accent" />
        <path
          d="M60 172h280M72 172l-20 92M328 172l20 92M120 172l-6 92M280 172l6 92M60 172v-14h280v14M88 158V92h224v66M88 92l112-44 112 44"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>

    <div v-else class="mx-auto flex max-w-[860px] flex-col gap-6 px-gutter pt-[clamp(64px,10vw,144px)]">
      <p class="text-overline font-semibold text-danger uppercase">
        {{ t('errors.server.overline', { code: error.statusCode || 500 }) }}
      </p>
      <h1 class="text-[clamp(2.25rem,1.6rem+3vw,4rem)] leading-[1.05] font-normal text-balance">
        {{ t('errors.server.titleStart') }} <em>{{ t('errors.server.titleEmphasis') }}</em>
      </h1>
      <p class="max-w-[32em] text-[18px] text-foreground-muted">{{ t('errors.server.text') }}</p>
      <div class="flex flex-wrap gap-4">
        <UiButton size="lg" @click="retry">{{ t('ui.retry') }}</UiButton>
        <UiButton size="lg" variant="ghost" @click="goHome">{{ t('errors.home') }}</UiButton>
      </div>
    </div>
  </NuxtLayout>
</template>
