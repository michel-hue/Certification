<template>
  <header class="sticky top-0 z-50 bg-gray-900 shadow p-4">
  <div class="flex flex-col md:flex-row items-center justify-between gap-4">

    <!-- Nom de la boutique -->
    <h1 class="flex items-center gap-2 text-2xl font-bold text-white">
      Ma Boutique
      <i class="fa-solid fa-cart-shopping text-blue-500"></i>
    </h1>

    <!-- Barre de recherche -->
    <form @submit.prevent="rechercherProduit" class="flex flex-1 justify-center gap-2 max-w-lg w-full">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Rechercher un produit..."
        class="w-full px-3 py-2 border rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button class="bg-blue-400 text-white px-4 py-2 rounded hover:bg-green-500">
        Rechercher
      </button>
    </form>

    <!-- Navigation -->
<nav>
  <ul class="flex gap-6 text-white font-medium">
    <li>
      <a href="/users/products" class="flex items-center gap-2 hover:text-green-500 transition">
        <div class="w-9 h-9 flex items-center justify-center rounded-full bg-gray-200 hover:bg-green-600 text-blue-600 hover:text-white transition">
          <i class="fas fa-bag-shopping"></i>
        </div>
        Products
      </a>
    </li>

    <li>
      <a href="/users/carts" class="flex items-center gap-2 hover:text-green-500 transition">
        <div class="w-9 h-9 flex items-center justify-center rounded-full bg-gray-200 hover:bg-green-600 text-blue-400 hover:text-white transition">
          <i class="fa-solid fa-cart-shopping"></i>
        </div>
        Panier
      </a>
    </li>

    <li>
      <a href="/users/products/categories" class="flex items-center gap-2 hover:text-green-500 transition">
        <div class="w-9 h-9 flex items-center justify-center rounded-full bg-gray-200 hover:bg-green-600 text-blue-500 hover:text-white transition">
          <i class="fa-solid fa-layer-group"></i>
        </div>
        Catégories
      </a>
    </li>

    <li>
      <a href="/users/users/dashoard" class="flex items-center gap-2 hover:text-green-500 transition">
        <div class="w-9 h-9 flex items-center justify-center rounded-full bg-gray-200 hover:bg-green-600 text-blue-500 hover:text-white transition">
          <i class="fa-solid fa-user"></i>
        </div>
        Profil
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












