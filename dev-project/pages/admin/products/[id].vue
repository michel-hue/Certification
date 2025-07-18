<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 font-sans text-gray-900 dark:text-gray-100">
    <!-- Bouton Retour -->
    <NuxtLink
      to="/admin/products"
      class="inline-flex items-center mb-6 text-sm font-semibold text-gray-700 dark:text-gray-200 border rounded-xl px-4 py-2 bg-white dark:bg-gray-800 hover:bg-green-600 transition"
    >
      <i class="fas fa-arrow-left mr-2"></i>
      Retour
    </NuxtLink>

    <!-- Carte principale produit -->
    <div class="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <!-- Catégorie -->
      <div class="mb-4">
        <span
          class="inline-flex items-center gap-2 text-sm text-blue-600 font-semibold bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full"
        >
          <i class="fas fa-tags"></i>
          {{ product.category }}
        </span>
      </div>

      <div class="flex flex-col md:flex-row gap-6 items-center justify-between">
        <!-- Infos -->
        <div class="flex-1">
          <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            {{ product.title }}
          </h2>

          <div v-if="product.rating" class="text-sm text-gray-600 dark:text-gray-300 flex flex-col gap-2 mb-2">
            <i class="fas fa-star text-yellow-400 mr-1"></i>
            <p>
              {{ product.rating.rate }} / 5
            </p>
            <p>({{ product.rating.count }} avis)</p>
          </div>

          <p class="text-xl font-semibold text-green-600 flex items-center gap-2">
            <i class="fas fa-dollar-sign"></i>
            {{ product.price }}
          </p>
        </div>

        <!-- Image -->
        <div class="bg-gray-100 dark:bg-gray-700 rounded-xl p-4 shadow-inner w-64 h-64 flex items-center justify-center">
          <img :src="product.image" :alt="product.title" class="w-full h-full object-contain rounded" />
        </div>
      </div>

      <!-- Actions admin -->
      <div class="mt-6 flex flex-wrap gap-6">
        <NuxtLink
          :to="`/admin/products/edit/${product.id}`"
          class="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
        >
          <i class="fas fa-edit"></i>
          Modifier
        </NuxtLink>

        <button
          @click="deleteProduct"
          class="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition flex items-center gap-2"
        >
          <i class="fas fa-trash"></i>
          Supprimer
        </button>
      </div>
    </div>

    <!-- Carte description -->
    <div class="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mt-10">
      <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
        <i class="fas fa-align-left text-blue-600"></i>
        Description
      </h3>
      <p class="text-gray-700 dark:text-gray-300 leading-relaxed text-justify">
        {{ product.description }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter, useHead } from '#imports'
import { ref } from 'vue'



// Récupération des données produit
const route = useRoute()
const router = useRouter()
const id = route.params.id as string

const product = ref(null)

const { data, error } = await useAsyncData('product-id', () =>
  $fetch(`https://fakestoreapi.com/products/${id}`)
)

if (error.value) {
  console.error(error.value)
} else {
  product.value = data.value
}

// Suppression produit
async function deleteProduct() {
  if (!confirm('Voulez-vous vraiment supprimer ce produit ?')) return
  try {
    await $fetch(`/api/products/${id}`, { method: 'DELETE' })
    alert('Produit supprimé avec succès')
    router.push('/admin/products')
  } catch (err) {
    alert('Erreur lors de la suppression')
    console.error(err)
  }
}
</script>
