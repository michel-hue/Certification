<template>
  <div class="min-h-screen bg-gray-100 p-6 font-sans">
    <!-- 🔙 Bouton retour -->
    <NuxtLink
      to="/users/products"
      class="inline-flex items-center mb-6 text-sm font-semibold text-gray-700 border rounded-xl px-4 py-2 bg-white hover:bg-green-600 hover:text-white transition"
    >
      <i class="fas fa-arrow-left mr-2"></i> Retour
    </NuxtLink>

    <!-- 🛒 Titre principal -->
    <h1 class="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
      <i class="fas fa-shopping-cart text-green-600"></i>
      Mon panier
    </h1>

    <!-- ✅ Affichage des produits du panier -->
    <div v-if="cartItems.length" class="space-y-6">
      <div
        v-for="(item, index) in cartItems"
        :key="item.id"
        class="bg-white rounded-xl shadow p-4 flex items-center justify-between"
      >
        <!-- 🖼️ Image produit -->
        <img :src="item.image" alt="image produit" class="w-16 h-16 object-contain" />

        <!-- ℹ️ Infos produit -->
        <div class="flex-1 ml-4">
          <p class="font-semibold text-gray-800">{{ item.title }}</p>
          <p class="text-gray-500 text-sm">Quantité : {{ item.quantity }}</p>
          <p class="text-sm text-green-600 font-semibold">
            Prix unitaire : {{ item.price }} $
          </p>
        </div>

        <!-- ❌ Bouton supprimer -->
        <button
          @click="removeFromCart(item.id)"
          class="text-red-600 hover:text-red-800 transition text-sm"
        >
          <i class="fas fa-trash mr-1"></i> Supprimer
        </button>
      </div>

      <!-- 💰 Total général -->
      <div class="text-right mt-6 text-xl font-bold text-gray-800">
        Total : {{ totalPrice.toFixed(2) }} $
      </div>

      <!-- 🧹 Bouton vider tout le panier -->
      <div class="text-right mt-4">
        <button
          @click="clearCart"
          class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
        >
          <i class="fas fa-trash-alt mr-2"></i> Vider le panier
        </button>
      </div>
    </div>

    <!-- 🚫 Si le panier est vide -->
    <div v-else class="text-gray-500 italic flex items-center gap-2 mt-6">
      <i class="fas fa-info-circle"></i>
      Votre panier est vide.
    </div>
  </div>
</template>

<script setup>
// 📦 Import du store du panier
import { useCartStore } from '~/stores/useCartStore'
import { storeToRefs } from 'pinia'

// 🔁 Récupération des données et méthodes du store
const cartStore = useCartStore()
const { items: cartItems } = storeToRefs(cartStore)
const { removeFromCart, clearCart } = cartStore

// 💸 Calcul du total des produits dans le panier
const totalPrice = computed(() => {
  return cartItems.value.reduce((total, item) => {
    return total + item.price * item.quantity
  }, 0)
})
// 🔐 Active le middleware d’auth
definePageMeta({
  middleware: 'auth'
})
</script>
