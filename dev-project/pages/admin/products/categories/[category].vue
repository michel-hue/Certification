<template>
    <!-- Bouton Retour -->
  <div class="p-4 bg-white shadow-md sticky top-0 z-10">
    <NuxtLink to="/admin/products/categories">
      <button
        class="inline-flex items-center text-sm font-semibold text-gray-700 border rounded-xl px-4 py-2 bg-white hover:bg-green-600 transition"
        aria-label="Retour aux produits"
      >
        <i class="fa-solid fa-arrow-left mr-2"></i> Retour
      </button>
    </NuxtLink>
  </div>
  <section class="p-6 min-h-screen bg-gray-100">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-3xl font-bold text-center text-gray-800 mb-6">
        🗂️ Catégorie : <span class="capitalize">{{ category }}</span>
      </h1>

      <div v-if="loading" class="text-center text-gray-500">Chargement…</div>
      <div v-else-if="error" class="text-center text-red-600 font-semibold">
        Erreur : {{ error.message }}
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <NuxtLink
          v-for="product in products"
          :key="product.id"
          :to="`/admin/products/${product.id}`"
          class="bg-white shadow rounded-xl p-4 text-center hover:shadow-lg transition hover:scale-105"
        >
          <!-- Catégorie -->
          <button class="text-xs text-blue-600 mb-2 border rounded-xl p-1 bg-gray-200">
            <i class="fas fa-tag mr-1"></i>
            {{ product.category }}
          </button>

          <!-- Image -->
          <img
            :src="product.image"
            :alt="product.title"
            class="h-40 w-full object-contain mb-4"
          />

          <!-- Titre -->
          <p class="font-semibold text-gray-800 mb-1">
            {{ product.title }}
          </p>

          <!-- Prix -->
          <p class="text-green-600 font-bold mb-2">
            <i class="fas fa-dollar-sign mr-1"></i>{{ product.price }}
          </p>

          <!-- Note -->
          <p class="text-yellow-500">
            <i class="fas fa-star mr-1"></i>
            {{ product.rating?.rate ?? 'N/A' }} / 5
          </p>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'

const route = useRoute()
const category = route.params.category

const products = ref([])
const error = ref(null)
const loading = ref(true)

onMounted(async () => {
  try {
    products.value = await $fetch(`https://fakestoreapi.com/products/category/${category}`)
  } catch (e) {
    error.value = e
  } finally {
    loading.value = false
  }
})
</script>
