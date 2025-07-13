<template> 
  <!-- Bouton Retour -->
  <div class="p-4 bg-white shadow-md sticky top-0 z-10">
    <NuxtLink to="/products/categories">
      <button
        class="inline-flex items-center text-sm font-semibold text-gray-700 border rounded-xl px-4 py-2 bg-white hover:bg-green-600 transition"
      >
        <i class="fa-solid fa-arrow-left mr-2"></i> Retour
      </button>
    </NuxtLink>
  </div>

  <section class="p-6 bg-gray-50 min-h-screen">
    <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">
      <i class="fas fa-tags mr-2 text-blue-600"></i>Catégorie :
      <span class="capitalize">{{ category }}</span>
    </h2>

    <div v-if="!categorie" class="text-center text-gray-500">
      <i class="fas fa-spinner fa-spin mr-2"></i>Chargement des produits…
    </div>

    <div v-else>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <NuxtLink
          v-for="product in categorie.products"
          :key="product.id"
          :to="`/products/${product.id}`"
          class="block bg-white rounded-xl p-4 shadow hover:shadow-lg hover:scale-105 transition-all text-center"
        >
          <img
            :src="product.image"
            :alt="product.title"
            class="h-40 w-full object-contain mb-4"
          />

          <p class="font-semibold text-gray-800 mb-1 line-clamp-2">
            <i class="fas fa-box mr-1 text-gray-500"></i>{{ product.title }}
          </p>

          <p class="text-blue-600 font-bold mb-1">
            <i class="fas fa-dollar-sign mr-1 text-green-600"></i>{{ product.price }}
          </p>

          <p class="text-yellow-500 text-sm flex justify-center items-center gap-1 mb-2">
            <i class="fas fa-star"></i>
            {{ product.rating?.rate || 'N/A' }}
            <span class="text-gray-600 text-xs">({{ product.rating?.count || 0 }} avis)</span>
          </p>

          <span class="inline-block bg-gray-200 text-xs text-gray-600 px-3 py-1 rounded-full">
            <i class="fas fa-tag mr-1"></i>{{ product.category }}
          </span>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const category = route.params.category as string
const categorie = ref<any>(null)

categorie.value = await $fetch(`/api/products/${category}`)
</script>

