<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 font-sans text-gray-800 dark:text-gray-200">
    <!-- Header Dashboard -->
    <header
      class="flex flex-col sm:flex-row items-center justify-between bg-white dark:bg-gray-800 shadow-md p-4 rounded-xl mb-6 border border-transparent dark:border-green-600"
    >
      <NuxtLink
        to="/users/"
        class="inline-flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 border rounded-xl px-4 py-2 bg-white dark:bg-gray-700 hover:bg-green-600 hover:text-white transition"
      >
        <i class="fas fa-arrow-left mr-2"></i>
        Retour
      </NuxtLink>

      <h1 class="text-2xl font-bold flex items-center gap-2 mt-4 sm:mt-0">
        <i class="fas fa-chart-line text-green-600"></i>
        Tableau de bord utilisateur
      </h1>
    </header>

    <div v-if="user && carts">
      <!-- Grille des Infos -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Informations Utilisateur -->
        <div class="col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow border border-transparent dark:border-gray-700">
          <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
            <i class="fas fa-id-badge text-blue-600"></i>
            Mes informations
          </h2>
          <div class="space-y-2">
            <p><i class="fas fa-user mr-2 text-gray-500 dark:text-gray-400"></i> Prénom : {{ user.name.firstname }}</p>
            <p><i class="fas fa-user mr-2 text-gray-500 dark:text-gray-400"></i> Nom : {{ user.name.lastname }}</p>
            <p><i class="fas fa-envelope mr-2 text-gray-500 dark:text-gray-400"></i> Email : {{ user.email }}</p>
            <p><i class="fas fa-phone mr-2 text-gray-500 dark:text-gray-400"></i> Téléphone : {{ user.phone }}</p>
            <p><i class="fas fa-user-tag mr-2 text-gray-500 dark:text-gray-400"></i> Nom d’utilisateur : {{ user.username }}</p>
          </div>

          <NuxtLink
            :to="`/users/users/edit/${user.id}`"
            class="inline-flex items-center mt-6 px-4 py-2 bg-gray-900 hover:bg-green-600 text-white rounded-xl transition"
          >
            <i class="fas fa-pen mr-2"></i>
            Modifier mes informations
          </NuxtLink>
        </div>

        <!-- Carte résumé -->
        <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow border border-transparent dark:border-gray-700">
          <h2 class="text-lg font-semibold mb-4 flex items-center gap-2">
            <i class="fas fa-boxes text-purple-600"></i>
            Activité récente
          </h2>
          <p class="text-gray-600 dark:text-gray-400 mb-2">
            <i class="fas fa-shopping-cart mr-2 text-green-600"></i>
            Nombre de paniers : {{ carts.length }}
          </p>
          <p class="text-gray-600 dark:text-gray-400">
            <i class="fas fa-calendar-alt mr-2 text-blue-500"></i>
            Dernière activité : {{ latestCartDate }}
          </p>

          <div class="mt-4">
            <NuxtLink
              to="/users/carts"
              class="inline-block text-sm font-medium text-white bg-green-600 px-4 py-2 rounded-xl hover:bg-green-700"
            >
              Voir mes paniers
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Message pendant chargement -->
    <div v-else class="text-center text-gray-500 dark:text-gray-400 mt-20">
      Chargement des données utilisateur...
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// On crée des variables réactives pour stocker l'utilisateur, ses paniers, et la date du dernier panier
const user = ref(null)             
const carts = ref([])              
const latestCartDate = ref('Aucune donnée')  


const userId = process.client ? Number(localStorage.getItem('userId')) : null


onMounted(async () => {
  if (!process.client || !userId) return

  try {
    // On récupère les infos de l'utilisateur via l'API
    user.value = await $fetch(`https://fakestoreapi.com/users/${userId}`)

    // On récupère la liste de tous ses paniers
    const response = await $fetch(`https://fakestoreapi.com/carts/user/${userId}`)
    carts.value = response

    // Si l'utilisateur a au moins un panier
    if (response.length > 0) {
      const lastCart = response[response.length - 1]
      latestCartDate.value = new Date(lastCart.date).toLocaleDateString()
    }
  } catch (err) {
    console.error('Erreur chargement données utilisateur :', err)
  }
})

definePageMeta({
  middleware: 'auth'
})
</script>

