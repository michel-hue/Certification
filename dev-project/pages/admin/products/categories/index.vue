<template>
  <!-- Barre de navigation haut -->
  <div class="p-4 bg-white shadow sticky top-0 z-10">
    <NuxtLink to="/admin">
      <button
        class="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 border border-gray-300 rounded-xl px-4 py-2 bg-white hover:bg-green-600 hover:text-white transition"
        aria-label="Retour à l'administration"
      >
        <i class="fas fa-arrow-left"></i> Retour
      </button>
    </NuxtLink>
  </div>

  <!-- Contenu principal -->
  <section class="p-6 bg-gray-100 min-h-screen font-sans">
    <!-- Titre -->
    <h2 class="text-3xl font-bold text-center text-gray-800 mb-10 flex items-center justify-center gap-3">
      <i class="fas fa-tags text-gray-900 text-2xl"></i>
      Toutes les catégories
    </h2>

    <!-- Erreur -->
    <div v-if="error" class="text-red-600 text-center font-semibold flex items-center justify-center gap-2">
      <i class="fas fa-exclamation-triangle"></i>
      <p>Erreur : {{ error.message }}</p>
    </div>

    <!-- Chargement -->
    <div v-else-if="pending" class="text-center text-gray-500 italic flex items-center justify-center gap-2">
      <i class="fas fa-spinner fa-spin text-gray-400"></i>
      Chargement des catégories…
    </div>

    <!-- Liste des catégories -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <NuxtLink
        v-for="(category, index) in categories"
        :key="index"
        :to="`/admin/products/categories/${category}`"
        class="relative group block bg-white rounded-2xl p-6 shadow hover:shadow-xl hover:scale-105 transition-all"
      >
        <!-- Icône flottante -->
        <div class="absolute -top-5 -left-5 bg-gray-900 text-white rounded-full p-3 shadow-lg group-hover:bg-green-600 transition">
          <i class="fas fa-layer-group text-xl"></i>
        </div>

        <!-- Texte -->
        <div class="text-center pt-6">
          <p class="text-lg font-semibold text-gray-700 capitalize group-hover:text-green-600 transition">
            {{ category }}
          </p>
        </div>
      </NuxtLink>
    </div>
  </section>
</template>

<script setup>
const { data: categories, pending, error } = await useFetch('https://fakestoreapi.com/products/categories')
</script>
