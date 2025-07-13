<template>
  <div class="min-h-screen bg-gray-100 p-6 font-sans">
    <!-- Bouton Retour -->
    <NuxtLink to="/admin/products" class="inline-flex items-center mb-6 text-sm font-semibold text-gray-700 border rounded-xl px-4 py-2 bg-white hover:bg-green-600 transition">
      <font-awesome-icon :icon="['fas', 'arrow-left']" class="mr-2" />
      Retour à la liste
    </NuxtLink>

    <div class="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6">
      <!-- Catégorie -->
      <div class="mb-4">
        <span class="inline-flex items-center gap-2 text-sm text-blue-600 font-semibold bg-gray-200 px-3 py-1 rounded-full">
          <font-awesome-icon :icon="['fas', 'tags']" />
          {{ product.category }}
        </span>
      </div>

      <div class="flex flex-col md:flex-row gap-6 items-center justify-between">
        <!-- Infos à gauche -->
        <div class="flex-1">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">{{ product.title }}</h2>

          <div v-if="product.rating" class="text-sm text-gray-600 flex flex-col gap-2 mb-2">
            <p><font-awesome-icon :icon="['fas', 'star']" class="text-yellow-400" /> {{ product.rating.rate }} / 5</p>
            <p>({{ product.rating.count }} avis)</p>
          </div>

          <p class="text-xl font-semibold text-green-600 flex items-center gap-2">
            <font-awesome-icon :icon="['fas', 'dollar-sign']" />
            {{ product.price }}
          </p>
        </div>

        <!-- Image -->
        <div class="bg-gray-100 rounded-xl p-4 shadow-inner w-64 h-64 flex items-center justify-center">
          <img :src="product.image" :alt="product.title" class="w-full h-full object-contain rounded" />
        </div>
      </div>

      <!-- Actions admin -->
      <div class="mt-6 flex flex-wrap gap-6">
        <NuxtLink :to="`/admin/products/${product.id}/edit`" class="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
          <font-awesome-icon :icon="['fas', 'pen']" />
          Modifier
        </NuxtLink>

        <button
          @click="deleteProduct"
          class="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition flex items-center gap-2"
        >
          <font-awesome-icon :icon="['fas', 'trash']" />
          Supprimer
        </button>
      </div>

      <!-- Description -->
      <div class="mt-10">
        <h3 class="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <font-awesome-icon :icon="['fas', 'align-left']" class="text-blue-600" />
          Description
        </h3>
        <p class="text-gray-700 leading-relaxed text-justify">{{ product.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const product = ref(null)
const id = route.params.id as string

// Chargement produit via API server-side Nuxt (ou directement FakeStore si tu veux)
product.value = await $fetch (`https://fakestoreapi.com/products/${id}`)

async function deleteProduct() {
  if (!confirm('Voulez-vous vraiment supprimer ce produit ?')) return
  try {
    await $fetch(`/api/products/${id}`, { method: 'DELETE' })
    alert('Produit supprimé avec succès')
    router.push('/admin/products')
  } catch (error) {
    alert('Erreur lors de la suppression')
    console.error(error)
  }
}
</script>
