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
  <section class="p-6 bg-gray-50 min-h-screen">
    <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">Tous les produits</h2>

    <div v-if="error" class="text-red-600 text-center">
      <p>Erreur : {{ error.message }}</p>
    </div>

    <div v-else-if="pending" class="text-center text-gray-500">
      <p>Chargement…</p>
    </div>
   
    <div v-else>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <NuxtLink 
          v-for="product in products"
          :key="product.id"
          :to="`/admin/products/${product.id}`"
          class="bg-white shadow rounded-[15%] p-4 text-center hover:shadow-lg transition hover:scale-105 transition-all text-center"
        >
          <button class="inline-block text-xs text-blue-500 mb-2 border rounded-xl p-2 bg-gray-300">
            <i class="fas fa-tag mr-1"></i>
            {{ product.category }}
          </button>

          <img
            :src="product.image"
            :alt="product.title"
            class="h-40 w-full object-contain mb-4"
          />

          <p class="font-semibold text-gray-800 mb-1">{{ product.title }}</p>
         <p class="text-green-600 font-bold mb-2">
  <i class="fas fa-dollar-sign mr-1"></i>{{ product.price }} 
</p>
<!-- Note avec étoile -->
<p class="text-yellow-500 font-semibold text-center">
  <i class="fas fa-star mr-1"></i> Note : {{ product.rating.rate }}
</p>

<!-- Nombre d’avis avec une icône de commentaire -->
<p class="text-gray-700  text-center">
  <i class="fas fa-comment-alt mr-1 text-gray-500"></i> ({{ product.rating.count }}) Avis
</p>

        </NuxtLink>
      </div>
    </div>
  </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const searchQuery = ref('')

function rechercherProduit() {
  // ta logique de recherche ici
}

const { data: products, error, pending } = await useAsyncData('products', () =>
  $fetch('/api/products')
)
import { computed } from 'vue'

const rating = computed(() => {
  if (product && product.rating) {
    return product.rating
  }
  return { rate: 'N/A', count: 0 }
})

</script>
