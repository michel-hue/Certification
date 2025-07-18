<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 font-sans text-gray-800 dark:text-gray-200">

    <!--  Bouton Retour aux produits -->
    <NuxtLink
      to="/users/products"
      class="inline-flex items-center mb-6 text-sm font-semibold text-gray-700 dark:text-gray-300 border rounded-xl px-4 py-2 bg-white dark:bg-gray-800 hover:bg-green-600 hover:text-white transition"
    >
      <i class="fas fa-arrow-left mr-2"></i> Retour
    </NuxtLink>

    <!-- Affichage des détails du produit -->
    <div v-if="product" class="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">

      <!--  Catégorie du produit -->
      <div class="mb-4">
        <span
          class="inline-flex items-center gap-2 text-sm text-blue-600 font-semibold bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full"
        >
          <i class="fas fa-tags"></i> {{ product.category }}
        </span>
      </div>

      <div class="flex flex-col md:flex-row gap-6 items-center justify-between">
        <!--  Informations du produit -->
        <div class="flex-1">
          <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">{{ product.title }}</h2>

          <!--  Évaluation -->
          <div v-if="product.rating" class="text-sm flex flex-col gap-2 mb-2">
            <p class="text-yellow-400 dark:text-yellow-300"><i class="fas fa-star"></i> {{ product.rating.rate }} / 5</p>
            <p class="text-gray-600 dark:text-gray-400">({{ product.rating.count }} avis)</p>
          </div>

          <!--  Prix -->
          <p class="text-xl font-semibold text-green-600 flex items-center gap-2">
            <font-awesome-icon :icon="['fas', 'dollar-sign']" />
            {{ product.price }}
          </p>
        </div>

        <!-- Image produit -->
        <div
          class="bg-gray-100 dark:bg-gray-700 rounded-xl p-4 shadow-inner w-64 h-64 flex items-center justify-center"
        >
          <img :src="product.image" :alt="product.title" class="w-full h-full object-contain rounded" />
        </div>
      </div>

      <!-- 🛒 Ajouter au panier -->
      <div class="mt-6">
        <button
          @click="afficherQuantite = !afficherQuantite"
          class="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded transition w-full md:w-auto"
        >
          <i class="fas fa-cart-plus mr-2"></i> Ajouter au panier
        </button>
      </div>

      <!--  Choix de la quantité -->
      <div v-if="afficherQuantite" class="mt-4 flex items-center gap-3">
        <label for="quantity" class="font-semibold text-gray-700 dark:text-gray-300">Quantité :</label>
        <input
          id="quantity"
          type="number"
          min="1"
          v-model.number="quantity"
          class="w-16 border rounded px-2 py-1 text-center dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
        />
        <button
          @click="ajouterAuPanier"
          class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded transition"
        >
          Confirmer
        </button>
      </div>

      <!--  Description produit -->
      <div class="mt-10 bg-gray-50 dark:bg-gray-700 rounded-xl p-6 shadow-md">
        <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
          <font-awesome-icon :icon="['fas', 'align-left']" class="text-blue-600" />
          Description
        </h3>
        <p class="text-gray-700 dark:text-gray-300 leading-relaxed text-justify">{{ product.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
//  Store Pinia du panier
import { useCartStore } from '~/stores/useCartStore'
const cartStore = useCartStore()

import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const product = ref(null)
const id = route.params.id as string

//  Récupération du produit via API
product.value = await $fetch(`https://fakestoreapi.com/products/${id}`)

const quantity = ref(1) // Quantité choisie par l'utilisateur
const afficherQuantite = ref(false) // Afficher ou non le champ quantité

//  Ajouter le produit au panier avec la quantité
function ajouterAuPanier() {
  if (quantity.value < 1) {
    alert('La quantité doit être au moins de 1.')
    return
  }

  const produitAjoute = { ...product.value, quantity: quantity.value }
  cartStore.addToCart(produitAjoute)

  alert(`✅ ${product.value.title} ajouté au panier (x${quantity.value})`)
  afficherQuantite.value = false
}
</script>
