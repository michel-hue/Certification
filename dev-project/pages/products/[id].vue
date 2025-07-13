<template>
  <section class="p-6 bg-gray-100 min-h-screen font-sans">

    <!-- Bouton Retour -->
    <div class="p-4 bg-white shadow-md sticky top-0 z-10 mb-6">
      <NuxtLink to="/products">
        <button
          class="inline-flex items-center text-sm font-semibold text-gray-700 border rounded-xl px-4 py-2 bg-white hover:bg-green-600 transition"
          aria-label="Retour aux produits"
        >
          <font-awesome-icon :icon="['fas', 'arrow-left']" class="mr-2" /> Retour
        </button>
      </NuxtLink>
    </div>

    <!-- Carte principale produit -->
    <div class="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 mb-6">

      <!-- Catégorie -->
      <div class="mb-4">
        <span class="inline-flex items-center gap-2 text-sm text-blue-600 font-semibold bg-gray-200 px-3 py-1 rounded-full">
          <font-awesome-icon :icon="['fas', 'tag']" />
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
              <font-awesome-icon :icon="['fas', 'star']" class="text-yellow-400" />
              {{ product.rating.rate }} / 5
            </p>
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

      <!-- Bouton ajouter au panier -->
      <button
        @click="ajouterAuPanier"
        class="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition flex items-center gap-2 mt-6"
      >
        <font-awesome-icon :icon="['fas', 'cart-plus']" />
        Ajouter au panier
      </button>

      <!-- Message d'alerte si non connecté -->
      <div v-if="showMessage" class="mt-4 text-red-600 font-medium flex items-center gap-2">
        <font-awesome-icon :icon="['fas', 'lock']" />
        Veuillez vous connecter pour ajouter ce produit au panier.
      </div>
    </div>

    <!-- Description -->
    <div class="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6">
      <h3 class="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
        <font-awesome-icon :icon="['fas', 'align-left']" class="text-blue-600" />
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

function ajouterAuPanier() {
  if (!userStore.isLoggedIn) {
    showMessage.value = true
    setTimeout(() => {
      showMessage.value = false
    }, 3000)
    return
  }

  // Ici tu peux appeler ta logique d'ajout panier si besoin
  alert('Produit ajouté au panier')
}
</script>
