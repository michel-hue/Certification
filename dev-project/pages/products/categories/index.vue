<template> <br>
     <NuxtLink :to="`/products`">  <button class="inline-block text-xs text-white mb-2 border rounded-xl p-4 bg-gray-900">    < Retour </button> 
     </NuxtLink>
  <section class="p-6 bg-gray-100 min-h-screen">
    <h2 class="text-2xl font-bold text-center text-gray-800 mb-8">
      Toutes les catégories
    </h2>

    <div v-if="error" class="text-red-600 text-center">
      <p>Erreur : {{ error.message }}</p>
    </div>

    <div v-else-if="pending" class="text-center text-gray-500">
      <p>Chargement des catégories…</p>
    </div>

    <div v-else>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        <NuxtLink
          v-for="(category, index) in categories"
          :key="index"
          :to="`/products/categories/${category}`"
          class="group block bg-white rounded-xl p-6 shadow hover:shadow-xl hover:scale-105 transition-all text-center"
        >
          <div class="flex items-center justify-center h-16 w-16 mx-auto mb-4 bg-blue-100 text-blue-600 rounded-full group-hover:bg-gray-900 group-hover:text-white transition">
            <!-- Icône (facultatif) -->
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2"
              viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </div>
          <p class="font-semibold text-gray-700 capitalize group-hover:text-blue-600 transition">
            {{ category }}
          </p>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup>
const { data: categories, pending, error } = await useFetch('https://fakestoreapi.com/products/categories')
</script>
