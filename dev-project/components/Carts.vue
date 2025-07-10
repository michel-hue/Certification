<template>
  <NuxtLink to="/products">
    <button class="inline-block text-xs text-white mb-4 border rounded-xl px-4 py-2 bg-gray-900 hover:bg-gray-800 transition">
      ← Retour
    </button>
  </NuxtLink>

  <section class="p-6 bg-gray-100 min-h-screen">
    <h2 class="text-2xl font-bold text-center text-gray-800 mb-8">
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
          :to="`/carts/${cart.id}`"
          class="group block bg-white rounded-xl p-5 shadow hover:shadow-xl hover:scale-105 transition-all"
        >
          <div class="mb-3">
            <div class="flex items-center justify-center h-12 w-12 bg-green-100 text-green-600 rounded-full mx-auto group-hover:bg-gray-900 group-hover:text-white transition">
              <!-- Icône panier (optionnelle) -->
              <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 7M7 13l-1.5 7h11L17 13M9 21h6" />
              </svg>
            </div>
          </div>
          <h3 class="text-center font-semibold text-gray-700 mb-1 group-hover:text-green-600 transition">
            Panier #{{ cart.id }}
          </h3>
          <p class="text-center text-sm text-gray-600">
            Utilisateur : {{ cart.userID || cart.userId || 'N/A' }}
          </p>
          <p class="text-center text-xs text-gray-500">
            Date : {{ new Date(cart.date).toLocaleDateString() }}
          </p>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup>
const { data: carts, error, pending } = await useAsyncData('carts', () =>
  $fetch('/api/carts')
)
</script>

