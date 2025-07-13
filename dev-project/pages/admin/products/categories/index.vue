<template>
  <!-- Bouton Retour -->
  <div class="p-4 bg-white shadow-md sticky top-0 z-10">
    <NuxtLink to="/admin/products">
      <button
        class="inline-flex items-center text-sm font-semibold text-gray-700 border rounded-xl px-4 py-2 bg-white hover:bg-green-600 transition"
        aria-label="Retour aux produits"
      >
        <i class="fa-solid fa-arrow-left mr-2"></i> Retour
      </button>
    </NuxtLink>
  </div>

  <section class="p-6 bg-gray-100 min-h-screen font-sans">
    <h2 class="text-2xl font-bold text-center text-gray-800 mb-8 flex items-center justify-center gap-3">
      <i class="fas fa-th-large text-blue-600 text-xl"></i>
      Toutes les catégories
    </h2>

    <!-- Erreur -->
    <div v-if="error" class="text-red-600 text-center font-semibold flex items-center justify-center gap-2">
      <i class="fa-solid fa-circle-exclamation"></i>
      <p>Erreur lors du chargement : {{ error.message }}</p>
    </div>

    <!-- Chargement -->
    <div v-else-if="pending" class="text-center text-gray-500 italic flex items-center justify-center gap-2">
      <i class="fa-solid fa-spinner fa-spin text-gray-400"></i>
      Chargement des catégories…
    </div>

    <!-- Liste des catégories -->
    <div v-else>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        <NuxtLink
          v-for="(category, index) in categories"
          :key="index"
          :to="`/admin/products/categories/${category}`"
          class="group block bg-white rounded-xl p-6 shadow hover:shadow-xl hover:scale-105 transition-all text-center"
        >
          <div class="flex items-center justify-center h-16 w-16 mx-auto mb-4 bg-blue-100 text-blue-600 rounded-full group-hover:bg-green-500 group-hover:text-white transition">
            <i class="fa-solid fa-layer-group text-xl"></i>
          </div>
          <p class="font-semibold text-gray-700 capitalize group-hover:text-green-600 transition">
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
