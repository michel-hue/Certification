<template>
  <NuxtLink to="/carts">
    <button class="inline-block text-xs text-white mb-4 border rounded-xl px-4 py-2 bg-gray-900 hover:bg-gray-800 transition">
      ← Retour
    </button>
  </NuxtLink>

  <section class="p-6 bg-gray-100 min-h-screen font-sans">
    <div v-if="cart" class="max-w-3xl mx-auto bg-white rounded-xl shadow p-6">
      <h2 class="text-2xl font-bold mb-4 text-gray-800"> Panier #{{ cart.id }}</h2>
      <p class="text-gray-700 mb-2"><strong>Utilisateur :</strong> {{ cart.userId || 'N/A' }}</p>
      <p class="text-gray-700"><strong>Date :</strong> {{ new Date(cart.date).toLocaleDateString() }}</p>

      <div class="mt-6">
        <h3 class="text-lg font-semibold mb-4 text-gray-800"> Produits</h3>

        <div
          v-if="products.length > 0"
          class="space-y-4 divide-y divide-gray-200"
        >
          <div
            v-for="(product, index) in products"
            :key="index"
            class="pt-2"
          >
            <p class="text-gray-700">
              <strong>Produit ID :</strong> {{ product.productId || 'N/A' }}
            </p>
            <p class="text-gray-700">
              <strong>Quantité :</strong> {{ product.quantity || 0 }}
            </p>
          </div>
        </div>

        <div v-else class="text-gray-500 italic">
          Aucun produit dans ce panier.
        </div>
      </div>
    </div>

    <div v-else class="text-center text-gray-500 italic">
      Chargement du panier…
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const id = route.params.id

const cart = ref(null)
const products = ref([])

cart.value = await $fetch(`/api/carts/${id}`)

// Correction ici : FAKE STORE API → la bonne propriété est `products` (pas `product`)
if (cart.value.products) {
  products.value = cart.value.products
}
</script>
