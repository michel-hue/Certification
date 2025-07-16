<template>
  <div class="min-h-screen bg-gray-100 p-6 font-sans">
    <!-- Bouton Retour -->
    <NuxtLink to="/users/products" class="inline-flex items-center mb-6 text-sm font-semibold text-gray-700 border rounded-xl px-4 py-2 bg-white hover:bg-green-600 transition"> 
      <i class="fas fa-arrow-left mr-2"></i> Retour
    </NuxtLink>

   <div v-if="product" class="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6">

      <!-- Catégorie -->
      <div class="mb-4">
        <span class="inline-flex items-center gap-2 text-sm text-blue-600 font-semibold bg-gray-200 px-3 py-1 rounded-full"> 
          <i class="fas fa-tags"></i> {{ product.category }}
        </span>
      </div>

      <div class="flex flex-col md:flex-row gap-6 items-center justify-between">
        <!-- Infos à gauche -->
        <div class="flex-1">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">{{ product.title }}</h2>

          <div v-if="product.rating" class="text-sm text-gray-600 flex flex-col gap-2 mb-2">
            <p class="text-yellow-400"><i class="fas fa-star"></i> {{ product.rating.rate }} / 5</p>
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

      <!-- Bouton Ajouter au panier -->
      <div class="mt-6">
        <button 
          @click="afficherQuantite = !afficherQuantite" 
          class="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded transition w-full md:w-auto"
        >
          <i class="fas fa-cart-plus mr-2"></i> Ajouter au panier
        </button>
      </div>

      <!-- Champ quantité (affiché après clic) -->
      <div v-if="afficherQuantite" class="mt-4 flex items-center gap-3">
        <label for="quantity" class="font-semibold text-gray-700">Quantité :</label>
        <input 
          id="quantity"
          type="number" 
          min="1" 
          v-model.number="quantity" 
          class="w-16 border rounded px-2 py-1 text-center"
        />
        <button 
          @click="ajouterAuPanier" 
          class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded transition"
        >
          Confirmer
        </button>
      </div>

      <!-- Description dans une nouvelle carte -->
      <div class="mt-10 bg-gray-50 rounded-xl p-6 shadow-md">
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
import { useRoute } from 'vue-router'

const route = useRoute()
const product = ref(null)
const id = route.params.id as string

product.value = await $fetch(`https://fakestoreapi.com/products/${id}`)

const quantity = ref(1)
const afficherQuantite = ref(false)

function ajouterAuPanier() {
  if (quantity.value < 1) {
    alert('La quantité doit être au moins de 1.')
    return
  }

  alert(`Produit ajouté au panier : ${product.value.title} (Quantité: ${quantity.value})`)
}
</script>
