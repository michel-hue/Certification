<template>
  <!-- Haut de page avec bouton retour -->
  <div class="p-4 bg-white dark:bg-gray-900 shadow-md sticky top-0 z-10">
    <!-- Lien vers la page des catégories de produits -->
    <NuxtLink to="/admin/products/categories">
      <button
        class="inline-flex items-center text-sm font-semibold text-gray-700 dark:text-green-600 border border-gray-300 dark:border-green-600 rounded-xl px-4 py-2 bg-white dark:bg-gray-800 hover:bg-green-600 hover:text-white transition"
        aria-label="Retour aux produits"
      >
        <i class="fa-solid fa-arrow-left mr-2"></i> Retour
      </button>
    </NuxtLink>
  </div>

  <!-- Section principale avec les produits -->
  <section class="p-6 min-h-screen bg-gray-100 dark:bg-gray-900">
    <div class="max-w-6xl mx-auto">
      <!-- Titre de la page qui affiche la catégorie -->
      <h1 class="text-3xl font-bold text-center text-gray-800 dark:text-green-600 mb-6">
        Catégorie : <span class="capitalize">{{ category }}</span>
      </h1>

      <!-- Si ça charge, on affiche un petit texte -->
      <div v-if="loading" class="text-center text-gray-500 dark:text-gray-400">Chargement…</div>

      <!-- Si y’a une erreur, on l’affiche -->
      <div v-else-if="error" class="text-center text-red-600 dark:text-red-400 font-semibold">
        Erreur : {{ error.message }}
      </div>

      <!-- Sinon on affiche les produits -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <!-- On boucle sur chaque produit avec v-for -->
        <NuxtLink
          v-for="product in products"
          :key="product.id"
          :to="`/admin/products/${product.id}`"
          class="bg-white dark:bg-gray-800 shadow rounded-xl p-4 text-center hover:shadow-lg transition hover:scale-105"
        >
          <!-- Petite étiquette qui montre la catégorie -->
          <button
            class="text-xs text-blue-600 dark:text-green-600 mb-2 border border-gray-300 dark:border-green-600 rounded-xl p-1 bg-gray-200 dark:bg-gray-700"
          >
            <i class="fas fa-tag mr-1"></i>
            {{ product.category }}
          </button>

          <!-- Image du produit -->
          <img
            :src="product.image"
            :alt="product.title"
            class="h-40 w-full object-contain mb-4"
          />

          <!-- Nom du produit -->
          <p class="font-semibold text-gray-800 dark:text-green-600 mb-1">
            {{ product.title }}
          </p>

          <!-- Prix du produit -->
          <p class="text-green-600 font-bold mb-2">
            <i class="fas fa-dollar-sign mr-1"></i>{{ product.price }}
          </p>

          <!-- Note du produit -->
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
/* On importe des fonctions de Vue */
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'

/* On récupère la route actuelle pour savoir dans quelle catégorie on est */
const route = useRoute()
const category = route.params.category // ex : "electronics", "clothing", etc.

/* On crée des variables réactives pour les produits, l’erreur et le chargement */
const products = ref([])
const error = ref(null)
const loading = ref(true)

/* Quand la page est montée, on va chercher les produits de la bonne catégorie */
onMounted(async () => {
  try {
    // Appel à l’API avec la catégorie actuelle
    products.value = await $fetch(`https://fakestoreapi.com/products/category/${category}`)
  } catch (e) {
    // S’il y a une erreur, on la stocke
    error.value = e
  } finally {
    // Qu’il y ait erreur ou pas, on dit que le chargement est fini
    loading.value = false
  }
})
</script>
