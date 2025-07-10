<template>
  <header class="sticky top-0 z-50 bg-gray-900 shadow p-4">
  <div class="flex flex-col md:flex-row items-center justify-between gap-4">

    <!-- Nom de la boutique -->
    <h1 class="flex items-center gap-2 text-2xl font-bold text-white">
      Ma Boutique
      <i class="fa-solid fa-bag-shopping text-blue-500"></i>
    </h1>

    <!-- Barre de recherche -->
    <form @submit.prevent="rechercherProduit" class="flex flex-1 justify-center gap-2 max-w-lg w-full">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Rechercher un produit..."
        class="w-full px-3 py-2 border rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button class="bg-blue-400 text-white px-4 py-2 rounded hover:bg-gray-600">
        Rechercher
      </button>
    </form>

    <!-- Navigation -->
    <nav>
      <ul class="flex gap-4 text-white font-medium">
        <li>
          <a href="/users" class="flex items-center gap-2 hover:text-gray-600">
            <i class="fa-solid fa-user text-blue-400"></i> Se connecter
          </a>
        </li>
        <li>
          <a href="/carts" class="flex items-center gap-2 hover:text-gray-600">
            <i class="fa-solid fa-bag-shopping text-blue-400"></i> Panier
          </a>
        </li>
        <li>
          <a href="/products/categories" class="flex items-center gap-2 hover:text-gray-600">
            <i class="fa-solid fa-layer-group text-blue-500"></i> Catégories
          </a>
        </li>
        <li>
          <a href="#" class="flex items-center gap-2 hover:text-gray-600">
            <i class="fa-solid fa-envelope text-blue-500"></i> Contact
          </a>
        </li>
      </ul>
    </nav>

  </div>
</header>


 

</template>


<script setup>
import { ref } from 'vue'

const searchQuery = ref('')
const allProducts = ref([])      // Tous les produits récupérés depuis l'API
const filteredProducts = ref([]) // Produits affichés après recherche

// Charger les produits au démarrage
const { data, error } = await useFetch('/api/products')
allProducts.value = data.value
filteredProducts.value = data.value

// Fonction de recherche
function rechercherProduit() {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) {
    filteredProducts.value = allProducts.value // si rien tapé, tout montrer
  } else {
    filteredProducts.value = allProducts.value.filter(product =>
      product.title.toLowerCase().includes(q)
    )
  }
}
</script>












