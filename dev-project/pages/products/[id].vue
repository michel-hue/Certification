
<template>
  <section class="p-6 bg-gray-100 min-h-screen font-sans">

    <!-- Bouton Retour -->
    <div class="p-4 bg-white shadow-md sticky top-0 z-10 mb-6">
      <NuxtLink to="/products">
        <button
          class="inline-flex items-center text-sm font-semibold text-gray-700 border rounded-xl px-4 py-2 bg-white hover:bg-green-600 transition"
          aria-label="Retour aux produits"
        >
          <i class="fas fa-arrow-left mr-2"></i> Retour
        </button>
      </NuxtLink>
    </div>

    <!-- Carte principale produit -->
    <div class="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 mb-6">

      <!-- Catégorie -->
      <div class="mb-4">
        <span class="inline-flex items-center gap-2 text-sm text-blue-600 font-semibold bg-gray-200 px-3 py-1 rounded-full">
          <i class="fas fa-tag"></i>
          {{ product.category }}
        </span>
      </div>

      <!-- Contenu principal -->
      <div class="flex flex-col md:flex-row gap-6 items-center justify-between">
        <!-- Infos -->
        <div class="flex-1">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">
            {{ product.title }}
          </h2>

          <div v-if="product.rating" class="text-sm text-gray-600 flex flex-col items-start gap-2 mb-2">
            <p>
              <i class="fas fa-star text-yellow-400"></i>
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
        <div class="bg-gray-100 rounded-xl p-4 shadow-inner w-64 h-64 flex items-center justify-center">
          <img :src="product.image" :alt="product.title" class="w-full h-full object-contain rounded" />
        </div>
      </div>

      <!-- Bouton ajouter au panier -->
      <button
        @click="ajouterAuPanier"
        class="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition flex items-center gap-2 mt-6"
      >
        <i class="fas fa-cart-plus"></i>
        Ajouter au panier
      </button>

      <!-- Message d'alerte si non connecté -->
      <div v-if="showMessage" class="mt-4 text-red-600 font-medium flex items-center gap-2">
        <i class="fas fa-lock"></i>
        Veuillez vous connecter pour ajouter ce produit au panier.
      </div>
    </div>

    <!-- Description -->
    <div class="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6">
      <h3 class="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
        <i class="fas fa-align-left text-blue-600"></i>
        Description du produit
      </h3>
      <p class="text-gray-700 leading-relaxed text-justify">
        {{ product.description }}
      </p>
    </div>

  </section>
</template>


<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const id = route.params.id
const product = ref(null)
const showMessage = ref(false)
const userStore = useUserStore()

// Charger le produit
product.value = await $fetch(`https://fakestoreapi.com/products/${id}`)

// 📦 Importer le store
import { useCartStore } from '~/stores/useCartStore'
const cartStore = useCartStore()

function ajouterAuPanier() {
  if (quantity.value < 1) {
    alert('La quantité doit être au moins de 1.')
    return
  }

  // Ajouter le produit au panier via le store
  cartStore.addToCart(product.value, quantity.value)

  alert(`Produit ajouté au panier : ${product.value.title} (Quantité: ${quantity.value})`)

  // Optionnel: reset quantité et cacher le champ
  quantity.value = 1
  afficherQuantite.value = false
}

</script>
