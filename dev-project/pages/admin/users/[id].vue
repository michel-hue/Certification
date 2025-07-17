<template>
  <!-- Bouton Retour -->
  <div class="p-4 bg-white shadow-md sticky top-0 z-10">
    <NuxtLink to="/admin/users">
      <button
        class="inline-flex items-center text-sm font-semibold text-gray-700 border rounded-xl px-4 py-2 bg-white hover:bg-green-600 transition"
      >
        <i class="fa-solid fa-arrow-left mr-2"></i> Retour
      </button>
    </NuxtLink>
  </div>

  <section class="p-6 bg-gray-100 min-h-screen font-sans">
    <div v-if="user" class="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow space-y-4">
      <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <i class="fas fa-user-circle text-gray-600 text-lg"></i>
        Utilisateur #{{ user.id }}
      </h2>

      <div class="space-y-2">
        <p class="text-gray-700 flex items-center gap-2">
          <i class="fas fa-id-card text-gray-500 text-lg"></i>
          {{ user.name.firstname }} {{ user.name.lastname }}
        </p>

        <p class="text-gray-700 flex items-center gap-2">
          <i class="fas fa-envelope text-blue-500 text-lg"></i>
          {{ user.email }}
        </p>

        <p class="text-gray-700 flex items-center gap-2">
          <i class="fas fa-user text-purple-500 text-lg"></i>
          {{ user.username }}
        </p>

        <p class="text-gray-700 flex items-center gap-2">
          <i class="fas fa-phone-alt text-green-500 text-lg"></i>
          {{ user.phone }}
        </p>
         <p><i class="fas fa-user-tag mr-2 text-gray-500"></i> Nom d’utilisateur : {{ user.username }}</p>
          <p><i class="fas fa-user-tag mr-2 text-gray-500"></i> Mot de passe : {{ user.password }}</p>
      </div>

      <div class="mt-4 bg-gray-50 rounded-xl p-4">
        <h3 class="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
          <i class="fas fa-map-marker-alt text-red-500 text-lg"></i>
          Adresse
        </h3>
        <p class="text-gray-700 ml-6">
          {{ user.address.number }} {{ user.address.street }}<br>
          {{ user.address.city }}, {{ user.address.zipcode }}
        </p>
      </div>

      <!-- Boutons d'action -->
      <div class="mt-6 flex flex-wrap gap-4">
        <button
          @click="deleteUser(user.id)"
          class="bg-gray-900 text-white px-4 py-2 rounded hover:bg-red-600 transition flex items-center gap-2"
        >
          <i class="fa-solid fa-trash"></i>
          Supprimer
        </button>

        <NuxtLink :to="`/admin/users/edit/${user.id}`">
          <button
            class="bg-gray-900 text-white px-4 py-2 rounded hover:bg-blue-600 transition flex items-center gap-2"
          >
            <i class="fa-solid fa-pen-to-square"></i>
            Modifier
          </button>
        </NuxtLink>
      </div>
    </div>

    <div v-else class="text-center text-gray-500 italic">
      Chargement de l'utilisateur…
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const user = ref(null)
const carts = ref([])
const loadingCarts = ref(true)
const errorCarts = ref(null)

const route = useRoute()
const router = useRouter()
const id = route.params.id

// Récupération de l'utilisateur
try {
  user.value = await $fetch(`/api/users/${id}`)
} catch (err) {
  console.error('Erreur chargement utilisateur :', err)
}


// Suppression utilisateur
async function deleteUser(userId) {
  if (!confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) return

  try {
    await fetch(`/api/users/${userId}`, { method: 'DELETE' })
    alert('Utilisateur supprimé avec succès')
    router.push('/admin/users')
  } catch (error) {
    alert('Erreur lors de la suppression')
    console.error(error)
  }
}
</script>
