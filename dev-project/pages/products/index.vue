<template>
  <div>
    <!-- EN-TÊTE FIXE -->
    <header
      class="flex items-center justify-between gap-4 p-4 bg-white dark:bg-gray-900 dark:text-white shadow-md sticky top-0 z-10 flex-wrap"
    >
      <!-- Bouton retour -->
      <NuxtLink to="/">
        <button
          class="inline-flex items-center text-sm font-semibold border rounded-xl px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-green-600 hover:text-white transition"
          aria-label="Retour à l'accueil"
        >
          <i class="fas fa-arrow-left mr-2"></i>
          Retour
        </button>
      </NuxtLink>

      <!-- Recherche -->
      <div class="flex-1 flex justify-center w-full md:w-auto">
        <form @submit.prevent class="flex w-full max-w-md">
          <label for="search" class="sr-only">Recherche</label>
          <input
            v-model="searchQuery"
            id="search"
            type="text"
            placeholder="Rechercher un produit..."
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l-xl text-black dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-600 placeholder-gray-500 dark:placeholder-gray-400"
          />
          <button
            type="submit"
            class="bg-gray-300 dark:bg-gray-700 text-white px-4 py-2 rounded-r-xl hover:bg-green-600 transition"
            aria-label="Lancer la recherche"
          >
            Rechercher
          </button>
        </form>
      </div>
    </header>

    <!-- SECTION PRODUITS -->
    <section class="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h2
        class="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-8"
      >
        Tous les produits
      </h2>

      <div v-if="error" class="text-red-600 text-center mb-6">
        Erreur : {{ error.message }}
      </div>

      <div v-else-if="pending" class="text-center text-gray-500 dark:text-gray-400 mb-6">
        Chargement…
      </div>

      <div v-else>
        <div v-if="filteredProducts.length === 0" class="text-center text-gray-500 dark:text-gray-400 italic mb-6">
          Aucun produit ne correspond à votre recherche.
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <NuxtLink
            v-for="product in filteredProducts"
            :key="product.id"
            :to="`/products/${product.id}`"
            class="group bg-white dark:bg-gray-800 rounded-2xl shadow-md dark:shadow-gray-700 p-4 hover:shadow-xl hover:scale-[1.02] transform transition duration-300 flex flex-col items-center"
            role="link"
            :aria-label="`Voir les détails de ${product.title}`"
          >
            <!-- Badge catégorie -->
            <span class="text-xs text-green-700 bg-gray-300 dark:bg-gray-700 dark:text-green-400 px-3 py-1 rounded-full mb-3">
              <i class="fas fa-tag mr-1"></i>{{ product.category }}
            </span>

            <!-- Image -->
            <div class="bg-gray-100 dark:bg-gray-700 rounded-xl w-full h-40 flex items-center justify-center mb-4">
              <img
                :src="product.image"
                :alt="product.title"
                class="h-full object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            <!-- Nom -->
            <p class="font-semibold text-gray-800 dark:text-gray-100 text-center mb-1 line-clamp-2">
              {{ product.title }}
            </p>

            <!-- Prix -->
            <p class="text-green-600 dark:text-green-400 font-bold text-lg mb-2">
              <i class="fas fa-dollar-sign mr-1"></i>{{ product.price }}
            </p>

            <!-- Rating -->
            <div class="flex items-center justify-center gap-2 text-sm text-yellow-500 mb-1">
              <i class="fas fa-star"></i>
              <span>{{ product.rating.rate }}</span>
            </div>

            <!-- Nombre d'avis -->
            <p class="text-gray-500 dark:text-gray-400 text-xs">
              ({{ product.rating.count }} avis)
            </p>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, defineProps } from 'vue'

// On récupère une propriété (prop) transmise au composant : `searchQuery`
const props = defineProps({
  searchQuery: {
    type: String,
    default: ''       
  }
})

// On crée une variable réactive `searchQuery` basée sur la prop
const searchQuery = ref(props.searchQuery)

// On récupère les produits depuis une API locale `/api/products` grâce à `useAsyncData`
const { data: products, error, pending } = await useAsyncData('products', () =>
  $fetch('/api/products')
)

// On crée une version filtrée de la liste des produits
const filteredProducts = computed(() => {
  // Si les produits ne sont pas encore chargés, on retourne une liste vide
  if (!products.value) return []
  const query = searchQuery.value.toLowerCase().trim()

  // Si l’utilisateur n’a rien tapé, on retourne tous les produits
  if (!query) return products.value
  return products.value.filter(product =>
    [product.title, product.category].some(field =>
      field.toLowerCase().includes(query)
    )
  )
})
</script>


<style scoped>
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
