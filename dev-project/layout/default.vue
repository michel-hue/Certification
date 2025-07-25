<template>
  <div class="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-300">
    
    <!-- Barre du haut -->
    <header class="p-4 flex justify-between items-center shadow bg-white dark:bg-gray-800">
      <!-- Logo ou titre du site -->
      <h1 class="text-xl font-bold">Ma Boutique</h1>

      <!-- Bouton clair/sombre -->
      <button
        @click="toggleDark"
        class="text-2xl p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-green-600 dark:hover:bg-green-500 text-gray-800 dark:text-white transition"
      >
        <!-- Icône soleil/lune selon le thème -->
        <i :class="isDark ? 'fas fa-sun' : 'fas fa-moon'"></i>
      </button>
    </header>

    <!-- Ici s'affiche le contenu de la page -->
    <slot />
  </div>
</template>

<script setup>
import { ref, provide, onMounted } from 'vue'

// État du mode sombre global
const isDark = ref(false)

// Vérifie si thème sombre déjà activé
onMounted(() => {
  const theme = localStorage.getItem('theme')
  if (theme === 'dark') {
    document.documentElement.classList.add('dark')
    isDark.value = true
  }
})

// Fonction pour basculer de thème
function toggleDarkMode() {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}

// Fournir à tous les composants enfants
provide('isDark', isDark)
provide('toggleDarkMode', toggleDarkMode)
</script>
