<template>
  <div class="min-h-screen bg-gray-100 p-6 font-sans">
    <!-- Bouton retour -->
    <NuxtLink
      :to="`/users/products`"
      class="inline-flex items-center mb-6 text-sm font-semibold text-gray-700 border rounded-xl px-4 py-2 bg-white hover:bg-green-600 hover:text-white transition"
    >
      <i class="fas fa-arrow-left mr-2"></i>
      Retour
    </NuxtLink>

    <!-- Titre -->
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

  <!-- 🔧 Bouton modifier -->
  <NuxtLink
    :to="`/users/users/edit/${user.id}`"
    class="inline-flex items-center mt-6 px-4 py-2 bg-gray-900 hover:bg-green-600 text-white rounded-xl transition"
  >
    <i class="fas fa-pen mr-2"></i>
    Modifier mes informations
  </NuxtLink>
</div>
</div>

</template>


<script setup>
import { ref, onMounted } from 'vue'

// 🛠️ Utilise la route pour récupérer l'ID
const user = ref(null)
const carts = ref([])

// 🔐 Récupère l’ID utilisateur
const userId = process.client ? Number(localStorage.getItem('userId')) : null

onMounted(async () => {
  if (!process.client || !userId) return

  try {
    user.value = await $fetch(`https://fakestoreapi.com/users/${userId}`)
    carts.value = await $fetch(`https://fakestoreapi.com/carts/user/${userId}`)
  } catch (err) {
    console.error('Erreur chargement données utilisateur :', err)
  }
})

// 🔒 Active le middleware d’auth
definePageMeta({
  middleware: 'auth'
})
</script>

