<template>
  <div>
    <!-- En-tête -->
    <header class="flex justify-between items-center p-4 bg-white shadow-md sticky top-0 z-10">
      <!-- Bouton Retour -->
      <NuxtLink to="/admin">
        <button
          class="inline-flex items-center text-sm font-semibold text-gray-700 border rounded-xl px-4 py-2 bg-white hover:bg-green-600 transition"
        >
          <i class="fa-solid fa-arrow-left mr-2"></i> Retour
        </button>
      </NuxtLink>

      <!-- Bouton Ajouter un panier -->
      <NuxtLink to="/carts/add">
        <button class="text-sm text-white border rounded-xl px-4 py-2 bg-gray-900 hover:bg-green-600 transition">
          <i class="fa-solid fa-plus mr-2"></i> Ajouter un panier
        </button>
      </NuxtLink>
    </header>

    <!-- Contenu principal -->
    <section class="p-6 bg-gray-100 min-h-screen font-sans">
      <h2 class="text-2xl font-bold text-center text-gray-800 mb-8 flex items-center justify-center gap-2">
        <i class="fa-solid fa-cart-shopping text-blue-600"></i>
        Liste des paniers
      </h2>

      <div v-if="error" class="text-red-600 text-center font-semibold">
        <p>Erreur : {{ error.message }}</p>
      </div>

      <div v-else-if="pending" class="text-center text-gray-500 italic">
        <p>Chargement des paniers…</p>
      </div>

      <div v-else>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <NuxtLink
            v-for="cart in carts"
            :key="cart.id"
            :to="`/admin/carts/${cart.id}`"
            class="group block bg-white rounded-xl p-5 shadow hover:shadow-xl hover:scale-105 transition-all"
          >
            <div class="mb-3">
              <div
                class="flex items-center justify-center h-12 w-12 bg-blue-100 text-green-600 rounded-full mx-auto group-hover:bg-green-600 group-hover:text-white transition"
              >
                <i class="fa-solid fa-cart-shopping"></i>
              </div>
            </div>
            <h3 class="text-center font-semibold text-gray-700 mb-1 group-hover:text-green-600 transition">
              Panier #{{ cart.id }}
            </h3>
            <p class="text-center text-sm text-gray-600">
              Utilisateur : {{ cart.userId || cart.userID || 'N/A' }}
            </p>
            <p class="text-center text-xs text-gray-500">
              Date : {{ new Date(cart.date).toLocaleDateString() }}
            </p>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const { data: carts, error, pending } = await useAsyncData('carts', () =>
  $fetch('/api/carts')
)
</script>
