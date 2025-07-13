<template>
        <!-- Nom de l’app -->
      <div class="flex items-center justify-center gap-3 text-2xl font-bold">
        <i class="fas fa-user-shield text-green-600"></i>
        Tableau Admin
      </div>
  <div class="flex items-center justify-between gap-4 p-4 bg-white shadow-md sticky top-0 z-10 flex-wrap">
    
    <!-- Bouton retour admin -->
    <NuxtLink to="/admin" aria-label="Retour à l'administration">
      <button
        class="inline-flex items-center text-sm font-semibold text-gray-900 border rounded-xl px-4 py-2 bg-white hover:bg-green-600 hover:text-white transition"
      >
        <font-awesome-icon :icon="['fas', 'arrow-left']" class="mr-2" /> Retour
      </button>
    </NuxtLink>

    <!-- Formulaire recherche -->
    <div class="flex-1 flex justify-center">
      <form @submit.prevent="rechercherProduit" class="flex w-full max-w-md" role="search" aria-label="Recherche produits">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Rechercher un produit..."
          class="w-full px-4 py-2 border border-gray-300 rounded-l-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-600 placeholder-gray-500"
          aria-label="Recherche produit"
        />
        <button
          type="submit"
          class="bg-gray-900 text-white px-4 py-2 rounded-r-xl hover:bg-green-600 transition"
          aria-label="Lancer la recherche"
        >
          Rechercher
        </button>
      </form>
    </div>
    

    <!-- Bouton ajouter produit -->
    <NuxtLink :to="`/products/add`" aria-label="Ajouter un nouveau produit">
      <button
        class="inline-flex items-center text-sm text-white border rounded-xl px-4 py-2 bg-gray-900 hover:bg-green-600 transition"
      >
        <font-awesome-icon :icon="['fas', 'plus']" class="mr-1" /> Ajouter un produit
      </button>
    </NuxtLink>

  </div>

  <!-- Liste des produits -->
  <div class="p-4">
    <Products />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Products from '~/components/Products.vue'

const searchQuery = ref('')

function rechercherProduit() {
  // ta logique de recherche ici
}
</script>
