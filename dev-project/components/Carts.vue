<template>
  <div>
    <!-- En-tête avec le bouton retour et un bouton pour ajouter un nouveau panier -->
    <header class="flex justify-between items-center p-4 bg-white dark:bg-gray-900 shadow-md sticky top-0 z-10">
      <!-- Bouton pour revenir à la page admin principale -->
      <NuxtLink to="/admin">
        <button
          class="inline-flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 border rounded-xl px-4 py-2 bg-white dark:bg-gray-800 hover:bg-green-600 hover:text-white transition"
        >
          <i class="fa-solid fa-arrow-left mr-2"></i> Retour
        </button>
      </NuxtLink>

      <!-- Bouton pour aller à la page d'ajout d'un nouveau panier -->
      <NuxtLink to="/admin/carts/add">
        <button
          class="text-sm text-white border rounded-xl px-4 py-2 bg-gray-400 hover:bg-green-600 transition"
        >
          <i class="fa-solid fa-plus mr-2"></i> Ajouter un panier
        </button>
      </NuxtLink>
    </header>

    <!-- Contenu principal : affiche la liste des paniers -->
    <section class="p-6 bg-gray-100 dark:bg-gray-800 min-h-screen font-sans">
      <!-- Titre principal avec icône -->
      <h2
        class="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-8 flex items-center justify-center gap-2"
      >
        <i class="fa-solid fa-cart-shopping text-blue-600 dark:text-green-400"></i>
        Liste des paniers
      </h2>

      <!-- Affiche une erreur si la requête pour récupérer les paniers a échoué -->
      <div v-if="error" class="text-red-600 text-center font-semibold">
        <p>Erreur : {{ error.message }}</p>
      </div>

      <!-- Affiche un message de chargement tant que les paniers ne sont pas encore récupérés -->
      <div v-else-if="pending" class="text-center text-gray-500 italic dark:text-gray-400">
        <p>Chargement des paniers…</p>
      </div>

      <!-- Affiche la grille des paniers une fois que les données sont prêtes -->
      <div v-else>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <!-- Boucle sur chaque panier et crée un lien vers sa page détaillée -->
          <NuxtLink
            v-for="cart in carts"
            :key="cart.id"
            :to="`/admin/carts/${cart.id}`"
            class="group block bg-white dark:bg-gray-700 rounded-xl p-5 shadow hover:shadow-xl hover:scale-105 transition-all"
          >
            <!-- Icône panier dans un cercle stylisé -->
            <div class="mb-3">
              <div
                class="flex items-center justify-center h-12 w-12 bg-blue-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-full mx-auto group-hover:bg-green-600 group-hover:text-white transition"
              >
                <i class="fa-solid fa-cart-shopping"></i>
              </div>
            </div>

            <!-- Titre avec le numéro du panier -->
            <h3
              class="text-center font-semibold text-gray-700 dark:text-gray-200 mb-1 group-hover:text-green-600 transition"
            >
              Panier #{{ cart.id }}
            </h3>

            <!-- Affiche l'utilisateur associé au panier (id utilisateur) -->
            <p class="text-center text-sm text-gray-600 dark:text-gray-300">
              Utilisateur : {{ cart.userId || cart.userID || 'N/A' }}
            </p>

            <!-- Date du panier formatée en date locale -->
            <p class="text-center text-xs text-gray-500 dark:text-gray-400">
              Date : {{ new Date(cart.date).toLocaleDateString() }}
            </p>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// Ici on récupère les paniers depuis l'API via useAsyncData, c'est asynchrone donc on attend la réponse
const { data: carts, error, pending } = await useAsyncData('carts', () =>
  $fetch('/api/carts')
)
</script>
