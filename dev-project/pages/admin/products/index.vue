<template>
  <!-- Conteneur principal avec fond clair ou sombre selon le mode dark -->
  <div class="min-h-screen p-6 font-sans bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">

    <!--  Titre principal de la page -->
    <header class="flex items-center justify-center gap-3 text-3xl font-extrabold mb-8 select-none text-gray-900 dark:text-green-600">
      <i class="fas fa-user-shield"></i>
      Tableau Admin
    </header>

    <!--  Barre du haut avec 3 éléments : retour, recherche, ajout -->
    <div class="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl sticky top-0 z-20 shadow-lg bg-white dark:bg-gray-800 transition-colors duration-300">

      <!--  Bouton pour retourner à la page admin principale -->
      <NuxtLink to="/admin" aria-label="Retour à l'administration" class="inline-block">
        <button class="inline-flex items-center text-sm font-semibold rounded-xl px-5 py-2 transition-shadow shadow-sm hover:shadow-lg border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 hover:bg-green-600 hover:text-white">
          <i class="fas fa-arrow-left mr-2"></i> Retour
        </button>
      </NuxtLink>

      <!--  Formulaire pour rechercher un produit -->
      <form @submit.prevent class="flex w-full max-w-md" role="search" aria-label="Recherche produits">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Rechercher un produit..."
          class="flex-grow px-4 py-2 rounded-l-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition"
          aria-label="Recherche produit"
        />
        <button
          type="submit"
          class="px-6 py-2 rounded-r-xl bg-gray-300 dark:bg-gray-700 text-white hover:bg-green-600 transition-shadow shadow-sm hover:shadow-lg"
          aria-label="Lancer la recherche"
        >
          Rechercher
        </button>
      </form>

      <!--  Lien pour ajouter un nouveau produit -->
      <NuxtLink :to="`/admin/products/add`" aria-label="Ajouter un nouveau produit" class="inline-block">
        <button class="inline-flex items-center text-sm rounded-xl px-5 py-2 transition-shadow shadow-sm hover:shadow-lg text-black dark:text-white bg-gray-300 dark:bg-gray-700 hover:bg-green-600">
          <i class="fas fa-plus mr-2"></i> Ajouter un produit
        </button>
      </NuxtLink>
    </div>

    <!--  Section pour afficher tous les produits -->
    <section class="mt-8 p-6 rounded-xl shadow-lg min-h-[60vh] bg-white dark:bg-gray-800 transition-colors duration-300">
      <!--  Titre de la section -->
      <h2 class="text-3xl font-bold text-center mb-8 tracking-wide text-gray-900 dark:text-gray-100">
        Tous les produits
      </h2>

      <!--  Affichage erreur si la requête échoue -->
      <div v-if="error" class="text-red-600 text-center text-lg font-semibold">
        <p>Erreur : {{ error.message }}</p>
      </div>

      <!--  Affichage chargement -->
      <div v-else-if="pending" class="text-center text-lg italic text-gray-500 dark:text-gray-400">
        Chargement…
      </div>

      <!--  Résultat des produits filtrés -->
      <div v-else>
        <!-- Aucun produit trouvé -->
        <div v-if="filteredProducts.length === 0" class="text-center italic mb-8 font-medium text-gray-500 dark:text-gray-400">
          Aucun produit ne correspond à votre recherche.
        </div>

        <!-- Grille de produits -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <!--  Carte de chaque produit -->
          <NuxtLink
            v-for="product in filteredProducts"
            :key="product.id"
            :to="`/admin/products/${product.id}`"
            :aria-label="`Voir les détails de ${product.title}`"
            class="rounded-xl p-5 shadow-md hover:shadow-2xl transition transform hover:scale-[1.03] flex flex-col items-center cursor-pointer select-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <!-- Catégorie du produit -->
            <button class="inline-flex items-center justify-center text-xs text-blue-600 mb-4 border border-blue-300 rounded-xl px-3 py-1 bg-blue-50 select-none cursor-default" tabindex="-1">
              <i class="fas fa-tag mr-2"></i>
              {{ product.category }}
            </button>

            <!-- Image du produit -->
            <img :src="product.image" :alt="product.title" class="h-40 w-auto object-contain mb-5 rounded-lg" loading="lazy" decoding="async" />

            <!-- Titre du produit -->
            <p class="font-semibold truncate max-w-full mb-3 text-center" :title="product.title">
              {{ product.title }}
            </p>

            <!-- Prix -->
            <p class="text-green-700 dark:text-green-400 font-extrabold mb-3 flex items-center gap-1 text-lg">
              <i class="fas fa-dollar-sign"></i>
              {{ product.price.toFixed(2) }}
            </p>

            <!-- Note / Étoiles -->
            <p class="text-yellow-500 dark:text-yellow-400 font-semibold flex items-center gap-2 mb-2">
              <i class="fas fa-star"></i>
              Note : {{ product.rating.rate }}
            </p>

            <!-- Nombre d’avis -->
            <p class="text-gray-600 dark:text-gray-400 text-sm flex items-center gap-1">
              <i class="fas fa-comment-alt text-gray-400 dark:text-gray-600"></i>
              ({{ product.rating.count }}) avis
            </p>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'

// Variable pour stocker ce que l'utilisateur tape dans la recherche
const searchQuery = ref('')

// Requête pour récupérer les produits depuis l'API
const { data: products, error, pending } = await useAsyncData('products', () =>
  $fetch('/api/products')
)

// Fonction qui filtre les produits selon le titre et la recherche
const filteredProducts = computed(() => {
  if (!products.value) return []

  return products.value.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})
</script>
