<template>
  <!-- Bouton Retour -->
  <div class="p-4 bg-white shadow-md sticky top-0 z-10">
    <NuxtLink :to="`/admin/carts`">
      <button
        class="inline-flex items-center text-sm font-semibold text-gray-700 border rounded-xl px-4 py-2 bg-white hover:bg-green-600 transition"
        aria-label="Retour aux paniers"
      >
        <i class="fa-solid fa-arrow-left mr-2"></i> Retour
      </button>
    </NuxtLink>
  </div>

  <!-- Contenu principal -->
  <section class="p-6 bg-gray-100 min-h-screen font-sans">
    <div v-if="!loading && cart" class="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">
      <!-- Titre Panier -->
      <div class="border-b border-gray-200 pb-4 mb-6">
        <h2 class="text-3xl font-extrabold text-gray-800 flex items-center gap-3">
          <i class="fa-solid fa-cart-shopping text-blue-600 text-xl"></i>
          Détails du Panier #{{ cart.id }}
        </h2>
      </div>

      <!-- Infos utilisateur et date -->
      <div class="space-y-3 mb-6">
        <p class="text-gray-700 flex items-center gap-2">
          <i class="fa-solid fa-user text-gray-500"></i>
          <span class="font-medium">Utilisateur :</span>
          <span>{{ cart.userId || 'N/A' }}</span>
        </p>
        <p class="text-gray-700 flex items-center gap-2">
          <i class="fa-solid fa-calendar-days text-gray-500"></i>
          <span class="font-medium">Date :</span>
          <span>{{ new Date(cart.date).toLocaleString() }}</span>
        </p>
      </div>

      <!-- Produits du panier -->
      <div>
        <h3 class="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
          <i class="fa-solid fa-boxes-stacked text-green-600"></i>
          Produits du panier
        </h3>

        <div v-if="products.length" class="grid gap-4 sm:grid-cols-1">
          <div
            v-for="(product, index) in products"
            :key="index"
            class="bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm relative"
          >
            <!-- Badge ID produit -->
            <span class="absolute top-2 right-2 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
              #{{ product.productId }}
            </span>

            <p class="text-gray-800 flex items-center gap-2 mb-1 mt-2">
              <i class="fa-solid fa-layer-group text-purple-600"></i>
              <strong>Quantité :</strong> {{ product.quantity }}
            </p>
          </div>
        </div>

        <div v-else class="text-gray-500 italic mt-2 flex items-center gap-2">
          <i class="fa-solid fa-circle-info"></i>
          Aucun produit dans ce panier.
        </div>
      </div>

      <!-- Boutons actions -->
      <div class="mt-8 flex flex-col sm:flex-row gap-4">
        <!-- Modifier -->
        <NuxtLink :to="`/admin/carts/edit/${cart.id}`" class="w-full sm:w-auto">
          <button
            class="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-blue-600 text-white text-base font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <i class="fa-solid fa-pen-to-square"></i>
            Modifier
          </button>
        </NuxtLink>

        <!-- Supprimer -->
        <button
          @click="supprimerPanier"
          class="w-full sm:w-auto flex items-center justify-center gap-2 bg-gray-900 hover:bg-red-600 text-white text-base font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <i class="fa-solid fa-trash"></i>
          Supprimer
        </button>
      </div>
    </div>

    <!-- Chargement -->
    <div v-else-if="loading" class="text-center text-gray-500 italic mt-10 flex items-center justify-center gap-2">
      <i class="fa-solid fa-spinner fa-spin text-gray-400"></i>
      Chargement du panier…
    </div>

    <!-- Erreur -->
    <div v-else class="text-center text-red-600 font-semibold mt-10">
      <i class="fa-solid fa-triangle-exclamation mr-2"></i>
      Impossible de charger le panier.
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const id = route.params.id

const cart = ref(null)
const products = ref([])
const loading = ref(true)

try {
  cart.value = await $fetch(`/api/carts/${id}`)
  if (cart.value?.products) {
    products.value = cart.value.products
  }
} catch (err) {
  console.error('Erreur chargement panier :', err)
} finally {
  loading.value = false
}

const supprimerPanier = async () => {
  const confirmDelete = confirm("Voulez-vous vraiment supprimer ce panier ?")
  if (!confirmDelete) return

  try {
    await $fetch(`/api/carts/${id}`, {
      method: 'DELETE'
    })
    alert('✅ Panier supprimé avec succès.')
    router.push('/admin/carts')
  } catch (err) {
    console.error('❌ Erreur lors de la suppression :', err)
    alert('Erreur lors de la suppression du panier.')
  }
}
</script>
