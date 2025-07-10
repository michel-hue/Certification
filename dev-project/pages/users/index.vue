<template>
  <section class="p-6 bg-gray-100 min-h-screen font-sans">
    <h2 class="text-2xl font-bold text-center text-gray-800 mb-8">👥 Liste des utilisateurs</h2>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <div
        v-for="user in users"
        :key="user.id"
        class="bg-white p-4 rounded-xl shadow hover:shadow-lg transition"
      >
        <h3 class="text-lg font-semibold text-gray-800 mb-2">
          {{ user.name.firstname }} {{ user.name.lastname }}
        </h3>
        <p class="text-sm text-gray-600"><strong>ID :</strong> {{ user.id }}</p>
        <p class="text-sm text-gray-600"><strong>Email :</strong> {{ user.email }}</p>
        <p class="text-sm text-gray-600">
          <strong>Adresse :</strong><br>
          {{ user.address.number }} {{ user.address.street }},<br>
          {{ user.address.city }} ({{ user.address.zipcode }})
        </p>
        <p class="text-sm text-gray-600"><strong>Téléphone :</strong> {{ user.phone }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const users = ref([])
users.value = await $fetch('/api/users')
</script>
