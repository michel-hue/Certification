<template>
  <header class="bg-gray-900 shadow p-4">
    <div class="flex flex-col md:flex-row items-center justify-between gap-4">
      
      <!-- Nom de la boutique (à gauche) -->
      <h1 class="text-2xl font-bold text-white hover:scale-105 transition-all text-center text-blue-500">Ma Boutique</h1>

      <!-- Barre de recherche (au centre) -->
      <form @submit.prevent class="flex flex-1 justify-center gap-2 max-w-lg w-full">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Rechercher un produit..."
          class="w-full px-3 py-2 border rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          class="bg-gray-700 text-white px-4 py-2 rounded hover:bg-blue-900"
        >
          Rechercher
        </button>
      </form>

      <!-- Navigation (à droite) -->
      <nav>
        <ul class="flex gap-4 text-white font-medium">
          <li><a href="#" class="hover:text-blue-900">Se connecter</a></li>
          <li><a href="/carts" class="hover:text-blue-900">Panier</a></li>
          <li><a href="#" class="hover:text-blue-900">Contact</a></li>
          <li><a href="/products/categories" class="hover:text-blue-900">Categories</a></li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script setup>
const searchQuery = ref('')
</script>












