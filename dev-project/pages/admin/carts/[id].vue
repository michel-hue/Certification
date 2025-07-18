<template>
  <!-- Bouton Retour en haut, sticky pour rester visible quand on descend -->
  <div
    class="p-4 bg-white dark:bg-gray-800 shadow-md sticky top-0 z-10 transition-colors duration-300"
  >
    <NuxtLink :to="`/admin/carts`">
      <button
        class="inline-flex items-center text-sm font-semibold text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2 bg-white dark:bg-gray-900 hover:bg-green-600 hover:text-white transition"
        aria-label="Retour aux paniers"
      >
        <!-- Icône flèche et texte "Retour" -->
        <i class="fa-solid fa-arrow-left mr-2"></i> Retour
      </button>
    </NuxtLink>
  </div>

  <!-- Contenu principal de la page -->
  <section
    class="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen font-sans transition-colors duration-300"
  >
    <!-- Affiche les détails du panier seulement si ce n’est pas en train de charger et que le panier existe -->
    <div
      v-if="!loading && cart"
      class="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 transition-colors duration-300"
    >
      <!-- Titre avec icône -->
      <div class="border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
        <h2
          class="text-3xl font-extrabold text-gray-800 dark:text-gray-200 flex items-center gap-3"
        >
          <i class="fa-solid fa-cart-shopping text-blue-600 dark:text-blue-400 text-xl"></i>
          Détails du Panier #{{ cart.id }}
        </h2>
      </div>

      <!-- Infos utilisateur et date du panier -->
      <div class="space-y-3 mb-6 text-gray-700 dark:text-gray-300">
        <p class="flex items-center gap-2">
          <i class="fa-solid fa-user text-gray-500 dark:text-gray-400"></i>
          <span class="font-medium">Utilisateur :</span>
          <span>{{ cart.userId || 'N/A' }}</span> <!-- Affiche userId ou N/A si vide -->
        </p>
        <p class="flex items-center gap-2">
          <i class="fa-solid fa-calendar-days text-gray-500 dark:text-gray-400"></i>
          <span class="font-medium">Date :</span>
          <span>{{ new Date(cart.date).toLocaleString() }}</span> <!-- Date formatée lisible -->
        </p>
      </div>

      <!-- Liste des produits du panier -->
      <div>
        <h3
          class="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200 flex items-center gap-2"
        >
          <i class="fa-solid fa-boxes-stacked text-green-600 dark:text-green-400"></i>
          Produits du panier
        </h3>

        <!-- Affiche les produits si la liste n'est pas vide -->
        <div v-if="products.length" class="grid gap-4 sm:grid-cols-1">
          <div
            v-for="(product, index) in products"
            :key="index"
            class="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-4 shadow-sm relative transition-colors duration-300"
          >
            <!-- Badge avec l'id du produit en haut à droite -->
            <span
              class="absolute top-2 right-2 text-xs bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full"
            >
              #{{ product.productId }}
            </span>

            <!-- Quantité du produit -->
            <p class="text-gray-800 dark:text-gray-200 flex items-center gap-2 mb-1 mt-2">
              <i class="fa-solid fa-layer-group text-purple-600 dark:text-purple-400"></i>
              <strong>Quantité :</strong> {{ product.quantity }}
            </p>
          </div>
        </div>

        <!-- Message si aucun produit dans le panier -->
        <div
          v-else
          class="text-gray-500 dark:text-gray-400 italic mt-2 flex items-center gap-2"
        >
          <i class="fa-solid fa-circle-info"></i>
          Aucun produit dans ce panier.
        </div>
      </div>

      <!-- Boutons Modifier et Supprimer -->
      <div class="mt-8 flex flex-col sm:flex-row gap-4">
        <!-- Bouton Modifier redirige vers la page d'édition -->
        <NuxtLink :to="`/admin/carts/edit/${cart.id}`" class="w-full sm:w-auto">
          <button
            class="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-blue-600 text-white text-base font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <i class="fa-solid fa-pen-to-square"></i>
            Modifier
          </button>
        </NuxtLink>

        <!-- Bouton Supprimer qui lance la fonction supprimerPanier -->
        <button
          @click="supprimerPanier"
          class="w-full sm:w-auto flex items-center justify-center gap-2 bg-gray-900 hover:bg-red-600 text-white text-base font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <i class="fa-solid fa-trash"></i>
          Supprimer
        </button>
      </div>
    </div>

    <!-- Affiche un message de chargement si loading est vrai -->
    <div
      v-else-if="loading"
      class="text-center text-gray-500 dark:text-gray-400 italic mt-10 flex items-center justify-center gap-2 transition-colors duration-300"
    >
      <i class="fa-solid fa-spinner fa-spin text-gray-400 dark:text-gray-500"></i>
      Chargement du panier…
    </div>

    <!-- Affiche un message d'erreur si le panier ne charge pas -->
    <div
      v-else
      class="text-center text-red-600 dark:text-red-500 font-semibold mt-10 transition-colors duration-300"
    >
      <i class="fa-solid fa-triangle-exclamation mr-2"></i>
      Impossible de charger le panier.
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// On récupère les infos de la route pour prendre l'id du panier dans l'URL
const route = useRoute()
const router = useRouter()
const id = route.params.id

// Variables réactives pour stocker le panier, ses produits et l'état de chargement
const cart = ref(null)
const products = ref([])
const loading = ref(true)

// On charge les données du panier depuis l'API avec l'id
try {
  cart.value = await $fetch(`/api/carts/${id}`)
  // Si le panier a une liste de produits, on la stocke
  if (cart.value?.products) {
    products.value = cart.value.products
  }
} catch (err) {
  console.error('Erreur chargement panier :', err) // Affiche erreur en console si échec
} finally {
  loading.value = false // On stop le loading, que ça ait marché ou non
}

// Fonction pour supprimer le panier
const supprimerPanier = async () => {
  const confirmDelete = confirm('Voulez-vous vraiment supprimer ce panier ?') // Demande confirmation
  if (!confirmDelete) return // Si annule, on sort de la fonction

  try {
    // On envoie une requête DELETE à l'API pour supprimer
    await $fetch(`/api/carts/${id}`, {
      method: 'DELETE'
    })
    alert('✅ Panier supprimé avec succès.')
    router.push('/admin/carts') // Redirige vers la liste des paniers
  } catch (err) {
    console.error('❌ Erreur lors de la suppression :', err)
    alert('Erreur lors de la suppression du panier.')
  }
}
</script>
