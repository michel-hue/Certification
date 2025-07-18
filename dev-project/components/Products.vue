<template>
  <section class="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
    <!-- Titre principal centré avec couleur adaptée au mode clair/sombre -->
    <h2
      class="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-8"
      aria-level="2"
      role="heading"
    >
      Tous les produits
    </h2>

    <!-- Affiche une erreur si la récupération des produits plante -->
    <div v-if="error" class="text-red-600 text-center mb-6">
      <p>Erreur : {{ error.message }}</p>
    </div>

    <!-- Affiche un message de chargement pendant la requête -->
    <div v-else-if="pending" class="text-center text-gray-500 dark:text-gray-400 mb-6">
      <p>Chargement…</p>
    </div>

    <!-- Si pas d'erreur ni chargement, on affiche la liste -->
    <div v-else>
      <!-- Message quand aucun produit ne correspond à la recherche -->
      <div v-if="filteredProducts.length === 0" class="text-center text-gray-500 dark:text-gray-400 italic mb-6">
        Aucun produit ne correspond à votre recherche.
      </div>

      <!-- Grille responsive des produits -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <!-- Carte produit cliquable qui mène à la page détail -->
        <NuxtLink
          v-for="product in filteredProducts"
          :key="product.id"
          :to="`/users/products/${product.id}`"
          class="group bg-white dark:bg-gray-800 rounded-2xl shadow-md dark:shadow-gray-700 p-4 hover:shadow-xl hover:scale-[1.02] transform transition duration-300 flex flex-col items-center"
          role="link"
          :aria-label="`Voir les détails de ${product.title}`"
        >
          <!-- Petit badge avec la catégorie du produit -->
          <span class="text-xs text-green-700 bg-gray-300 dark:bg-gray-700 dark:text-green-400 px-3 py-1 rounded-full mb-3">
            <i class="fas fa-tag mr-1"></i>
            {{ product.category }}
          </span>

          <!-- Image du produit, avec effet zoom au survol -->
          <div class="bg-gray-100 dark:bg-gray-700 rounded-xl w-full h-40 flex items-center justify-center mb-4">
            <img
              :src="product.image"
              :alt="product.title"
              class="h-full object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          <!-- Titre du produit, limité à 2 lignes max -->
          <p class="font-semibold text-gray-800 dark:text-gray-100 text-center mb-1 line-clamp-2">
            {{ product.title }}
          </p>

          <!-- Prix en vert avec icône dollar -->
          <p class="text-green-600 dark:text-green-400 font-bold text-lg mb-2">
            <i class="fas fa-dollar-sign mr-1"></i>{{ product.price }}
          </p>

          <!-- Note (rating) avec étoiles et nombre -->
          <div class="flex items-center justify-center gap-2 text-sm text-yellow-500 mb-1">
            <i class="fas fa-star"></i>
            <span>{{ product.rating.rate }}</span>
          </div>

          <!-- Nombre d'avis en petit -->
          <p class="text-gray-500 dark:text-gray-400 text-xs">
            ({{ product.rating.count }} avis)
          </p>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, defineProps } from 'vue'

// On reçoit la recherche en prop pour filtrer la liste
const props = defineProps({
  searchQuery: {
    type: String,
    default: ''
  }
})

// On récupère les produits via une API interne
const { data: products, error, pending } = await useAsyncData('products', () =>
  $fetch('/api/products')
)

// Filtrage des produits selon la recherche (sur titre et catégorie)
const filteredProducts = computed(() => {
  if (!products.value) return []

  // On prépare la recherche en minuscules et sans espaces inutiles
  const query = props.searchQuery.toLowerCase().trim()

  // Si pas de recherche, on affiche tout
  if (!query) return products.value

  // Sinon, on filtre les produits qui ont la recherche dans le titre ou la catégorie
  return products.value.filter(product =>
    [product.title, product.category].some(field =>
      field.toLowerCase().includes(query)
    )
  )
})
</script>

<style scoped>
/* Style pour couper proprement les titres trop longs sur 2 lignes max */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2; /* limite à 2 lignes */
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
