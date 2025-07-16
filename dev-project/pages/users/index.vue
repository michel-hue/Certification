<template>
  <div class="flex items-center justify-between gap-4 p-4 bg-white shadow-md sticky top-0 z-10 flex-wrap">
    <NuxtLink to="/">
      <button
        class="inline-flex items-center text-sm font-semibold text-gray-700 border rounded-xl px-4 py-2 bg-white hover:bg-green-600 transition"
        aria-label="Retour à l'administration"
      >
        <font-awesome-icon :icon="['fas', 'arrow-left']" class="mr-2" /> Retour
      </button>
    </NuxtLink>

    <div class="flex-1 flex justify-center">
      <form @submit.prevent class="flex w-full max-w-md">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Rechercher un produit..."
          class="w-full px-4 py-2 border rounded-l-xl text-black focus:outline-none focus:ring-2 focus:ring-green-600 placeholder-gray-500"
          aria-label="Recherche produit"
        />
        <button
          class="bg-gray-900 text-white px-4 py-2 rounded-r-xl hover:bg-green-600 transition"
          aria-label="Lancer la recherche"
          type="submit"
        >
          Rechercher
        </button>
      </form>
    </div>
  </div>

  <!-- Liste des produits avec la prop search -->
  <div class="p-4">
    <Products :search-query="searchQuery" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Products from '~/components/Products.vue'

const searchQuery = ref('')
</script>
