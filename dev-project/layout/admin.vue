<template>
  <div class="space-y-8 p-6 dark:bg-gray-900 min-h-screen transition-colors duration-300">
    <!-- Bouton Déconnexion -->
    <NuxtLink to="/" class="fixed top-4 right-4 group z-50">
      <div class="p-3 rounded-full bg-gray-900 hover:bg-red-600 transition flex items-center gap-2 cursor-pointer dark:bg-gray-700">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" />
        </svg>
        <span class="text-white font-semibold select-none">Déconnexion</span>
      </div>
    </NuxtLink>

    <!-- Titre -->
    <h1 class="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
      <font-awesome-icon :icon="['fas', 'tachometer-alt']" class="text-green-600" />
      Tableau de bord
    </h1>

    <!-- Statistiques -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white dark:bg-gray-800 shadow rounded-xl p-6 border-l-4 border-green-600 flex items-center gap-4">
        <font-awesome-icon :icon="['fas', 'box-open']" class="text-green-600 text-4xl" />
        <div>
          <h2 class="text-lg font-semibold text-gray-700 dark:text-gray-300">Produits</h2>
          <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ productCount }}</p>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 shadow rounded-xl p-6 border-l-4 border-green-600 flex items-center gap-4">
        <font-awesome-icon :icon="['fas', 'users']" class="text-green-600 text-4xl" />
        <div>
          <h2 class="text-lg font-semibold text-gray-700 dark:text-gray-300">Utilisateurs</h2>
          <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ userCount }}</p>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 shadow rounded-xl p-6 border-l-4 border-green-600 flex items-center gap-4">
        <font-awesome-icon :icon="['fas', 'shopping-cart']" class="text-green-600 text-4xl" />
        <div>
          <h2 class="text-lg font-semibold text-gray-700 dark:text-gray-300">Commandes</h2>
          <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ orderCount }}</p>
        </div>
      </div>
    </div>

    <!-- Accès rapide -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <NuxtLink to="/admin/products" class="bg-gray-900 hover:bg-green-600 dark:bg-gray-800 dark:hover:bg-green-600 transition text-white p-6 rounded-xl shadow flex items-center justify-center gap-3 text-lg font-semibold">
        <font-awesome-icon :icon="['fas', 'edit']" />
        Gérer les Produits
      </NuxtLink>
      <NuxtLink to="/admin/users" class="bg-gray-900 hover:bg-green-600 dark:bg-gray-800 dark:hover:bg-green-600 transition text-white p-6 rounded-xl shadow flex items-center justify-center gap-3 text-lg font-semibold">
        <font-awesome-icon :icon="['fas', 'user']" />
        Voir les Utilisateurs
      </NuxtLink>
      <NuxtLink to="/admin/carts" class="bg-gray-900 hover:bg-green-600 dark:bg-gray-800 dark:hover:bg-green-600 transition text-white p-6 rounded-xl shadow flex items-center justify-center gap-3 text-lg font-semibold">
        <font-awesome-icon :icon="['fas', 'shopping-cart']" />
        Gérer les Commandes
      </NuxtLink>
      <NuxtLink to="/admin/products/categories" class="bg-gray-900 hover:bg-green-600 dark:bg-gray-800 dark:hover:bg-green-600 transition text-white p-6 rounded-xl shadow flex items-center justify-center gap-3 text-lg font-semibold">
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

onMounted(async () => {
  const products = await $fetch('/api/products')
  const users = await $fetch('/api/users')
  const carts = await $fetch('/api/carts')

  productCount.value = products?.length || 0
  userCount.value = users?.length || 0
  orderCount.value = carts?.length || 0
})
</script>
