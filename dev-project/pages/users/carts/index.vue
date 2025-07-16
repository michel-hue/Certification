<template>
  <div class="min-h-screen bg-gray-100 p-6 font-sans">
    <!-- Bouton retour -->
    <NuxtLink
      to="/users/products"
      class="inline-flex items-center mb-6 text-sm font-semibold text-gray-700 border rounded-xl px-4 py-2 bg-white hover:bg-green-600 hover:text-white transition"
    >
      <i class="fas fa-arrow-left mr-2"></i>
      Retour
    </NuxtLink>

    <!-- Titre -->
    <h1 class="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
      <i class="fas fa-shopping-cart text-green-600"></i>
      Mes paniers
    </h1>

    <!-- Liste des paniers -->
    <div v-if="carts.length" class="space-y-4">
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
        <i class="fas fa-chevron-right text-gray-400"></i>
      </NuxtLink>
    </div>

    <div v-else class="text-gray-500 italic flex items-center gap-2 mt-6">
      <i class="fas fa-info-circle"></i>
      Aucun panier trouvé pour votre compte.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const carts = ref([])

let userId = null

if (process.client) {
  userId = Number(localStorage.getItem('userId'))
  if (!userId || isNaN(userId)) {
    router.push('/users/auth/login') // redirige si non connecté
  }
}

onMounted(async () => {
  if (!process.client || !userId) return

  try {
    carts.value = await $fetch(`https://fakestoreapi.com/carts/user/${userId}`)
  } catch (err) {
    console.error('Erreur chargement des paniers :', err)
  }
})
</script>
