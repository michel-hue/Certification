<template>
  <div class="min-h-screen bg-gray-100 p-6 font-sans">
    <h1 class="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
      <i class="fas fa-user text-green-600"></i>
      Tableau de bord utilisateur
    </h1>

    <!-- Infos utilisateur -->
    <div v-if="user" class="bg-white p-6 rounded-xl shadow mb-6">
      <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
        <i class="fas fa-id-badge text-blue-600"></i>
        Mes informations
      </h2>
      <p><i class="fas fa-user mr-2 text-gray-500"></i> Prénom : {{ user.name.firstname }}</p>
      <p><i class="fas fa-user mr-2 text-gray-500"></i> Nom : {{ user.name.lastname }}</p>
      <p><i class="fas fa-envelope mr-2 text-gray-500"></i> Email : {{ user.email }}</p>
      <p><i class="fas fa-phone mr-2 text-gray-500"></i> Téléphone : {{ user.phone }}</p>
      <p><i class="fas fa-user-tag mr-2 text-gray-500"></i> Nom d’utilisateur : {{ user.username }}</p>
    </div>

    <!-- Liste des paniers -->
    <div v-if="carts.length" class="bg-white p-6 rounded-xl shadow">
      <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
        <i class="fas fa-shopping-basket text-purple-600"></i>
        Mes paniers
      </h2>
      <ul class="space-y-3">
        <li
          v-for="cart in carts"
          :key="cart.id"
          class="border border-gray-200 rounded-xl p-4 flex justify-between items-center"
        >
          <span>
            <i class="fas fa-cart-shopping text-green-600 mr-2"></i>
            Panier #{{ cart.id }}
          </span>
          <span class="text-sm text-gray-500">
            {{ new Date(cart.date).toLocaleDateString() }}
          </span>
        </li>
      </ul>
    </div>

    <div v-else class="text-gray-500 italic flex items-center gap-2 mt-6">
      <i class="fas fa-circle-info"></i>
      Aucun panier trouvé.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const user = ref(null)
const carts = ref([])

// ID utilisateur simulé
const userId = 1

onMounted(async () => {
  try {
    user.value = await $fetch(`https://fakestoreapi.com/users/${userId}`)
    carts.value = await $fetch(`https://fakestoreapi.com/carts/user/${userId}`)
  } catch (err) {
    console.error('Erreur chargement données utilisateur :', err)
  }
})
</script>
