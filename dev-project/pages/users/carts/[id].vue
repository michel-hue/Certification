<template>
  <div class="min-h-screen bg-gray-100 p-6 font-sans">
    <!-- Bouton retour -->
    <NuxtLink
      to="/users/carts"
      class="inline-flex items-center mb-6 text-sm font-semibold text-gray-700 border rounded-xl px-4 py-2 bg-white hover:bg-green-600 hover:text-white transition"
    >
      <i class="fas fa-arrow-left mr-2"></i>
      Retour
    </NuxtLink>

    <!-- Titre -->
    <h1 class="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
      <i class="fas fa-shopping-bag text-purple-600"></i>
      Détails du panier #{{ cartId }}
    </h1>

    <!-- Bouton de suppression -->
    <button
      @click="supprimerPanier"
      class="mb-6 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition"
    >
      <i class="fas fa-trash-alt mr-2"></i>
      Supprimer ce panier
    </button>

    <!-- Produits -->
    <div v-if="products.length" class="space-y-4">
      <div
        v-for="(item, index) in products"
        :key="index"
        class="bg-white border rounded-xl p-4 shadow flex justify-between items-center"
      >
        <div class="flex items-center gap-4">
          <img :src="item.product.image" class="w-16 h-16 object-contain rounded" />
          <div>
            <p class="font-semibold text-gray-800">{{ item.product.title }}</p>
            <p class="text-sm text-gray-500">Quantité : {{ item.quantity }}</p>
          </div>
        </div>
        <p class="text-green-600 font-bold">
          {{ (item.product.price * item.quantity).toFixed(2) }} $
        </p>
      </div>

      <div class="mt-6 text-xl font-bold text-right text-gray-800">
        Total : {{ total.toFixed(2) }} $
      </div>
    </div>

    <div v-else class="text-gray-500 italic">
      Aucun produit trouvé pour ce panier.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

//  On récupère les infos sur la route actuelle
const route = useRoute()
const router = useRouter()

//  ID du panier qu'on a cliqué
const cartId = route.params.id

//  Liste des produits dans le panier
const products = ref([])

//  Total du panier
const total = ref(0)

//  Lorsque la page est prête, on va chercher les données du panier
onMounted(async () => {
  if (!process.client) return // On vérifie qu’on est bien côté client

  try {
    //  On va chercher le panier avec son ID
    const cart = await $fetch(`https://fakestoreapi.com/carts/${cartId}`)

    //  Pour chaque produit du panier, on va chercher les infos complètes
    const allProducts = await Promise.all(
      cart.products.map(async (item) => {
        const product = await $fetch(`https://fakestoreapi.com/products/${item.productId}`)
        return {
          product,
          quantity: item.quantity,
        }
      })
    )

    //  On met à jour la liste des produits et on calcule le total
    products.value = allProducts
    total.value = allProducts.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    )
  } catch (err) {
    //  S’il y a une erreur (ex: ID incorrect), on redirige vers la liste
    console.error('Erreur chargement panier :', err)
    router.push('/users/carts')
  }
})

//  Fonction pour supprimer un panier (ici c'est juste une simulation)
function supprimerPanier() {
  if (confirm('Voulez-vous vraiment supprimer ce panier ?')) {
    alert('Ce panier a été supprimé (simulation locale).')
    router.push('/users/carts')
  }
}
</script>
