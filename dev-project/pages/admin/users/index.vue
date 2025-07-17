<template>
  <div class="min-h-screen bg-gray-100 text-gray-800">

    <!-- Header admin -->
    <header class="flex items-center justify-between px-6 py-4 bg-white shadow sticky top-0 z-10">
      <!-- Retour -->
      <NuxtLink to="/admin">
        <button class="inline-flex items-center text-sm font-semibold text-gray-700 border rounded-xl px-4 py-2 bg-white  hover:bg-green-600 rounded-xl px-4 py-2 transition">
          <i class="fa-solid fa-arrow-left mr-2"></i> Retour 
        </button>
      </NuxtLink>

      <!-- Nom de l’app -->
      <div class="flex items-center gap-3 text-2xl font-bold">
        <i class="fas fa-user-shield text-green-600"></i>
        Tableau Admin
      </div>

      <!-- Bouton "Ajouter un utilisateur" -->
      <NuxtLink to="/admin/users/add">
        <button class="bg-gray-900 hover:bg-green-600 text-white px-4 py-2 rounded-xl text-sm transition flex items-center gap-2">
          <i class="fas fa-user-plus"></i> Ajouter un utilisateur
        </button>
      </NuxtLink>
    </header>

    <!-- Contenu -->
    <section class="p-6">
      <h2 class="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <i class="fas fa-users-cog text-blue-600"></i>
        Liste des utilisateurs
      </h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <NuxtLink
          v-for="user in users"
          :key="user.id"
          :to="`/admin/users/${user.id}`"
          class="bg-white p-5 rounded-xl shadow hover:shadow-xl transition space-y-3 border border-gray-200"
        >
          <h3 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <i class="fas fa-user text-gray-500"></i>
            {{ user.name.firstname }} {{ user.name.lastname }}
          </h3>

          <p class="text-sm text-gray-600 flex items-center gap-2">
            <i class="fas fa-envelope text-blue-500"></i>
            {{ user.email }}
          </p>

          <p class="text-sm text-gray-600 flex items-center gap-2">
            <i class="fas fa-map-marker-alt text-red-500"></i>
            {{ user.address.number }} {{ user.address.street }}, {{ user.address.city }} ({{ user.address.zipcode }})
          </p>

          <p class="text-sm text-gray-600 flex items-center gap-2">
            <i class="fas fa-phone-alt text-green-500"></i>
            {{ user.phone }}
          </p>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const users = ref([])
users.value = await $fetch('/api/users')
</script>
