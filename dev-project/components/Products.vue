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
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <NuxtLink 
          v-for="product in products"
          :key="product.id"
          :to="`/products/${product.id}`"
          class="bg-white shadow rounded-[15%] p-4 text-center hover:shadow-lg transition hover:scale-105 transition-all text-center"
        >
          <button class="inline-block text-xs text-blue-500 mb-2 border rounded-xl p-2 bg-gray-300">
            {{ product.category }}
          </button>

          <img
            :src="product.image"
            :alt="product.title"
            class="h-40 w-full object-contain mb-4"
          />

          <p class="font-semibold text-gray-800 mb-1">{{ product.title }}</p>
          <p class="text-green-600 font-bold mb-2">{{ product.price }} $</p>
          <p class="text-red-900">Note : {{ product.rating.rate }}</p>
          <p>({{ product.rating.count }}) Avis </p>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup>
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

