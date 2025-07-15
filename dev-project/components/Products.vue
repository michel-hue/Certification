<template>
  <section class="p-6 bg-gray-50 min-h-screen">
    <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">Tous les produits</h2>

    <div v-if="error" class="text-red-600 text-center">
      <p>Erreur : {{ error.message }}</p>
    </div>

    <div v-else-if="pending" class="text-center text-gray-500">
      <p>Chargement…</p>
    </div>

    <div v-else>
      <div v-if="filteredProducts.length === 0" class="text-center text-gray-500 italic mb-6">
        Aucun produit ne correspond à votre recherche.
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <NuxtLink 
          v-for="product in filteredProducts"
          :key="product.id"
          :to="`/users/products/${product.id}`"
          class="bg-white shadow rounded-[15%] p-4 text-center hover:shadow-lg hover:scale-105 transform transition duration-300"
          :aria-label="`Voir les détails de ${product.title}`"
        >
          <!-- Catégorie -->
          <button class="inline-block text-xs text-blue-500 mb-2 border rounded-xl p-2 bg-gray-300 cursor-default">
            <i class="fas fa-tag mr-1"></i>
            {{ product.category }}
          </button>

          <!-- Image produit -->
          <img
            :src="product.image"
            :alt="product.title"
            class="h-40 w-full object-contain mb-4"
          />

          <!-- Titre produit -->
          <p class="font-semibold text-gray-800 mb-1">{{ product.title }}</p>

          <!-- Prix -->
          <p class="text-green-600 font-bold mb-2">
            <i class="fas fa-dollar-sign mr-1"></i>{{ product.price }}
          </p>

          <!-- Note -->
          <p class="text-yellow-500 font-semibold text-center">
            <i class="fas fa-star mr-1"></i> Note : {{ product.rating.rate }}
          </p>

          <!-- Nombre d’avis -->
          <p class="text-gray-700 text-center">
            <i class="fas fa-comment-alt mr-1 text-gray-500"></i> ({{ product.rating.count }}) Avis
          </p>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, defineProps } from 'vue'

const props = defineProps({
  searchQuery: {
    type: String,
    default: ''
  }
})

const { data: products, error, pending } = await useAsyncData('products', () =>
  $fetch('/api/products')
)

const filteredProducts = computed(() => {
  if (!products.value) return []

  if (!props.searchQuery.trim()) return products.value

  return products.value.filter(product =>
    product.title.toLowerCase().includes(props.searchQuery.toLowerCase())
  )
})
</script>
