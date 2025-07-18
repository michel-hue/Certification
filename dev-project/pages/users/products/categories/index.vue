<template> 
  <!-- Bouton Retour -->
  <div class="p-4 bg-white dark:bg-gray-900 shadow-md sticky top-0 z-10">
    <NuxtLink to="/">
      <button
        class="inline-flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 border rounded-xl px-4 py-2 bg-white dark:bg-gray-800 hover:bg-green-600 hover:text-white transition"
      >
        <i class="fa-solid fa-arrow-left mr-2"></i> Retour
      </button>
    </NuxtLink>
  </div>
  <section class="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
    <h2 class="text-2xl font-bold text-center text-gray-800 dark:text-gray-200 mb-8">
      <i class="fas fa-th-large mr-2 text-blue-600 dark:text-blue-400"></i>
      Toutes les catégories
    </h2>

    <div v-if="error" class="text-red-600 dark:text-red-500 text-center">
      <p>Erreur : {{ error.message }}</p>
    </div>

    <div v-else-if="pending" class="text-center text-gray-500 dark:text-gray-400">
      <p>Chargement des catégories…</p>
    </div>

    <div v-else>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        <NuxtLink
          v-for="(category, index) in categories"
          :key="index"
          :to="`/users/products/categories/${category}`"
          class="group block bg-white dark:bg-gray-800 rounded-xl p-6 shadow hover:shadow-xl hover:scale-105 transition-all text-center"
        >
          <div
            class="flex items-center justify-center h-16 w-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full group-hover:bg-green-500 group-hover:text-white transition"
          >
            <i class="fa-solid fa-layer-group text-blue-500 dark:text-blue-300"></i> 
          </div>
          <p class="font-semibold text-gray-700 dark:text-gray-300 capitalize group-hover:text-green-500 transition">
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
