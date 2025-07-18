<template>
  <div class="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-300">
    <!-- Navbar ou Header -->
    <header class="p-4 flex justify-between items-center shadow bg-white dark:bg-gray-800">
      <h1 class="text-xl font-bold">Ma Boutique</h1>

      <!-- Bouton switch clair/sombre -->
      <button
        @click="toggleDark"
        class="text-2xl p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-green-600 dark:hover:bg-green-500 text-gray-800 dark:text-white transition"
      >
        <i :class="isDark ? 'fas fa-sun' : 'fas fa-moon'"></i>
      </button>
    </header>

    <!-- Contenu de la page -->
    <slot />
  </div>
</template>

<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>
