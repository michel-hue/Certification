<template>
  <div class="space-y-8 p-6">
    <!-- Titre -->
    <h1 class="text-3xl font-bold text-gray-800 flex items-center gap-3">
      <font-awesome-icon :icon="['fas', 'tachometer-alt']" class="text-green-600" />
      Tableau de bord
    </h1>

    <!-- Statistiques en résumé -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Produits -->
      <div class="bg-white shadow rounded-xl p-6 border-l-4 border-green-600 flex items-center gap-4">
        <font-awesome-icon :icon="['fas', 'box-open']" class="text-green-600 text-4xl" />
        <div>
          <h2 class="text-lg font-semibold text-gray-700">Produits</h2>
          <p class="text-3xl font-bold text-gray-900">{{ productCount }}</p>
        </div>
      </div>

      <!-- Utilisateurs -->
      <div class="bg-white shadow rounded-xl p-6 border-l-4 border-green-600 flex items-center gap-4">
        <font-awesome-icon :icon="['fas', 'users']" class="text-green-600 text-4xl" />
        <div>
          <h2 class="text-lg font-semibold text-gray-700">Utilisateurs</h2>
          <p class="text-3xl font-bold text-gray-900">{{ userCount }}</p>
        </div>
      </div>

      <!-- Commandes -->
      <div class="bg-white shadow rounded-xl p-6 border-l-4 border-green-600 flex items-center gap-4">
        <font-awesome-icon :icon="['fas', 'shopping-cart']" class="text-green-600 text-4xl" />
        <div>
          <h2 class="text-lg font-semibold text-gray-700">Commandes</h2>
          <p class="text-3xl font-bold text-gray-900">{{ orderCount }}</p>
        </div>
      </div>
    </div>

    <!-- Section d'accès rapide -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <NuxtLink to="/admin/products" class="bg-gray-900 hover:bg-green-600 transition text-white p-6 rounded-xl shadow flex items-center justify-center gap-3 text-lg font-semibold">
        <font-awesome-icon :icon="['fas', 'edit']" />
        Gérer les Produits
      </NuxtLink>
      <NuxtLink to="/admin/users" class="bg-gray-900 hover:bg-green-600 transition text-white p-6 rounded-xl shadow flex items-center justify-center gap-3 text-lg font-semibold">
        <font-awesome-icon :icon="['fas', 'user']" />
        Voir les Utilisateurs
      </NuxtLink>
      <NuxtLink to="/admin/carts" class="bg-gray-900 hover:bg-green-600 transition text-white p-6 rounded-xl shadow flex items-center justify-center gap-3 text-lg font-semibold">
        <font-awesome-icon :icon="['fas', 'shopping-cart']" />
        Gérer les Commandes
      </NuxtLink>
      <NuxtLink to="/admin/products/categories" class="bg-gray-900 hover:bg-green-600 transition text-white p-6 rounded-xl shadow flex items-center justify-center gap-3 text-lg font-semibold">
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
