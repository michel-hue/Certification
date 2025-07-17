<template>
  <div class="min-h-screen bg-gray-100 p-6 font-sans">
    
    <!-- Bouton retour -->
    <NuxtLink
      to="/users/products"
      class="inline-flex items-center mb-4 text-sm font-semibold text-gray-700 border rounded-xl px-4 py-2 bg-white hover:bg-green-600 hover:text-white transition"
    >
      <i class="fas fa-arrow-left mr-2"></i> Retour
    </NuxtLink>

    <!-- Bouton panier local (Pinia) -->
    <NuxtLink
      to="/users/cart"
      class="inline-flex items-center mb-6 ml-4 text-sm font-semibold text-white bg-green-600 px-4 py-2 rounded-xl hover:bg-green-700 transition"
    >
      <i class="fas fa-shopping-basket mr-2"></i> Voir mon panier actuel
    </NuxtLink>

    <!-- Titre -->
    <h1 class="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
      <i class="fas fa-shopping-cart text-green-600"></i>
      Mes paniers
    </h1>

    <!-- Chargement -->
    <div v-if="pending" class="text-center text-gray-500 mb-6">
      Chargement des paniers…
    </div>

    <!-- Liste des paniers -->
    <div v-else-if="carts.length" class="space-y-4">
      <NuxtLink
        v-for="cart in carts"
        :key="cart.id"
        :to="`/users/carts/${cart.id}`"
        class="block bg-white rounded-xl p-4 shadow border border-gray-200 flex justify-between items-center hover:bg-green-50 transition"
      >
        <div>
          <p class="text-gray-800 font-semibold">
            Panier #{{ cart.id }}
          </p>
          <p class="text-sm text-gray-500">
            Date : {{ new Date(cart.date).toLocaleDateString() }}
          </p>
        </div>
        <i class="fas fa-chevron-right text-gray-400" aria-hidden="true"></i>
      </NuxtLink>
    </div>

    <!-- Aucun panier trouvé -->
    <div v-else class="text-gray-500 italic flex items-center gap-2 mt-6">
      <i class="fas fa-info-circle"></i>
      Aucun panier trouvé pour votre compte.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const carts = ref([])
const pending = ref(true)
const userId = ref(null)

const router = useRouter()

onMounted(async () => {
  // Récupération userId du localStorage
  const id = Number(localStorage.getItem('userId'))

  // Si pas connecté, on redirige
  if (!id || isNaN(id)) {
    router.push('/users/auth/login')
    return
  }

  userId.value = id

  try {
    // Récupération des paniers pour cet utilisateur
    carts.value = await $fetch(`https://fakestoreapi.com/carts/user/${id}`)
  } catch (err) {
    console.error('Erreur chargement des paniers :', err)
  } finally {
    pending.value = false
  }
})
</script>
