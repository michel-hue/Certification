<template>
  <div :class="['space-y-8 p-6 min-h-screen transition-colors duration-300', isDark ? 'bg-gray-900 text-white' : 'bg-gray-300 text-gray-900']">
    
    <!-- Bouton Déconnexion -->
    <NuxtLink to="/" class="fixed top-4 right-4 group z-50">
      <div
        :class="[
          'p-3 rounded-full transition relative cursor-pointer flex items-center gap-2',
          isDark ? 'bg-gray-700 hover:bg-red-600' : 'bg-gray-900 hover:bg-red-600'
        ]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" />
        </svg>
        <span class="text-white font-semibold select-none">Déconnexion</span>
      </div>
    </NuxtLink>

    <!-- Titre + Toggle Dark Mode -->
    <div class="flex items-center justify-between gap-3">
      <h1 :class="['text-3xl font-bold flex items-center gap-3', isDark ? 'text-white' : 'text-gray-800']">
        <font-awesome-icon :icon="['fas', 'tachometer-alt']" class="text-green-600" />
        Tableau de bord
      </h1>

      <button
        @click="toggleDarkMode"
        :aria-label="isDark ? 'Passer en mode clair' : 'Passer en mode sombre'"
        class="p-2 rounded-full border border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition"
      >
        <i :class="isDark ? 'fas fa-sun' : 'fas fa-moon'"></i>
      </button>
    </div>

    <!-- Statistiques en résumé -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Produits -->
      <div
        :class="[
          'shadow rounded-xl p-6 border-l-4 border-green-600 flex items-center gap-4',
          isDark ? 'bg-gray-800' : 'bg-white'
        ]"
      >
        <font-awesome-icon :icon="['fas', 'box-open']" class="text-green-600 text-4xl" />
        <div>
          <h2 :class="[isDark ? 'text-gray-300' : 'text-gray-700', 'text-lg font-semibold']">Produits</h2>
          <p :class="[isDark ? 'text-white' : 'text-gray-900', 'text-3xl font-bold']">{{ productCount }}</p>
        </div>
      </div>

      <!-- Utilisateurs -->
      <div
        :class="[
          'shadow rounded-xl p-6 border-l-4 border-green-600 flex items-center gap-4',
          isDark ? 'bg-gray-800' : 'bg-white'
        ]"
      >
        <font-awesome-icon :icon="['fas', 'users']" class="text-green-600 text-4xl" />
        <div>
          <h2 :class="[isDark ? 'text-gray-300' : 'text-gray-700', 'text-lg font-semibold']">Utilisateurs</h2>
          <p :class="[isDark ? 'text-white' : 'text-gray-900', 'text-3xl font-bold']">{{ userCount }}</p>
        </div>
      </div>

      <!-- Commandes -->
      <div
        :class="[
          'shadow rounded-xl p-6 border-l-4 border-green-600 flex items-center gap-4',
          isDark ? 'bg-gray-800' : 'bg-white'
        ]"
      >
        <font-awesome-icon :icon="['fas', 'shopping-cart']" class="text-green-600 text-4xl" />
        <div>
          <h2 :class="[isDark ? 'text-gray-300' : 'text-gray-700', 'text-lg font-semibold']">Commandes</h2>
          <p :class="[isDark ? 'text-white' : 'text-gray-900', 'text-3xl font-bold']">{{ orderCount }}</p>
        </div>
      </div>
    </div>

    <!-- Section d'accès rapide -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <NuxtLink
        to="/admin/products"
        :class="[
          'transition p-6 rounded-xl shadow flex items-center justify-center gap-3 text-lg font-semibold',
          isDark ? 'bg-gray-800 hover:bg-green-600 text-white' : 'bg-gray-400  hover:bg-green-600 text-black'
        ]"
      >
        <font-awesome-icon :icon="['fas', 'edit']" />
        Gérer les Produits
      </NuxtLink>

      <NuxtLink
        to="/admin/users"
        :class="[
          'transition p-6 rounded-xl shadow flex items-center justify-center gap-3 text-lg font-semibold',
          isDark ? 'bg-gray-800 hover:bg-green-600 text-white' : 'bg-gray-400  hover:bg-green-600 text-black'
        ]"
      >
        <font-awesome-icon :icon="['fas', 'user']" />
        Voir les Utilisateurs
      </NuxtLink>

      <NuxtLink
        to="/admin/carts"
        :class="[
          'transition p-6 rounded-xl shadow flex items-center justify-center gap-3 text-lg font-semibold',
          isDark ? 'bg-gray-800 hover:bg-green-600 text-white' : 'bg-gray-400  hover:bg-green-600 text-black'
        ]"
      >
        <font-awesome-icon :icon="['fas', 'shopping-cart']" />
        Gérer les Commandes
      </NuxtLink>

      <NuxtLink
        to="/admin/products/categories"
        :class="[
          'transition p-6 rounded-xl shadow flex items-center justify-center gap-3 text-lg font-semibold',
          isDark ? 'bg-gray-800 hover:bg-green-600 text-white' : 'bg-gray-400  hover:bg-green-600 text-black'
        ]"
      >
        <font-awesome-icon :icon="['fas', 'tags']" />
        Gérer les Catégories
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const productCount = ref(0)
const userCount = ref(0)
const orderCount = ref(0)

const isDark = ref(false)

onMounted(() => {
  // Charger le thème depuis localStorage
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark') {
    isDark.value = true
    document.documentElement.classList.add('dark')
  } else {
    isDark.value = false
    document.documentElement.classList.remove('dark')
  }

  // Charger les données
  fetchData()
})

async function fetchData() {
  const products = await $fetch('/api/products')
  const users = await $fetch('/api/users')
  const carts = await $fetch('/api/carts')

  productCount.value = products?.length || 0
  userCount.value = users?.length || 0
  orderCount.value = carts?.length || 0
}

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
</script>
