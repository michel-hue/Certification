


<template>
  <!-- Bouton Retour -->
  <div class="p-4 bg-white shadow-md sticky top-0 z-10">
    <NuxtLink :to="`/admin/users/${user.id}`">
      <button
        class="inline-flex items-center text-sm font-semibold text-gray-700 border rounded-xl px-4 py-2 bg-white hover:bg-green-600 transition"
      >
        <i class="fa-solid fa-arrow-left mr-2"></i> Retour
      </button>
    </NuxtLink>
  </div>

  <section class="p-6 bg-gray-100 min-h-screen font-sans">
    <div v-if="user" class="max-w-xl mx-auto bg-white p-6 rounded-xl shadow space-y-6">
      <h2 class="text-2xl font-bold text-gray-800 mb-4 text-center">
        ✏️ Modifier l'utilisateur #{{ user.id }}
      </h2>

      <form @submit.prevent="updateUser" class="space-y-4">
        <div>
          <label class="block mb-1 text-sm font-medium">Prénom</label>
          <input v-model="user.name.firstname" class="w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label class="block mb-1 text-sm font-medium">Nom</label>
          <input v-model="user.name.lastname" class="w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label class="block mb-1 text-sm font-medium">Email</label>
          <input v-model="user.email" class="w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label class="block mb-1 text-sm font-medium">Téléphone</label>
          <input v-model="user.phone" class="w-full border rounded px-3 py-2" />
        </div>

        <button
          type="submit"
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Enregistrer les modifications
        </button>
      </form>
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
const route = useRoute()
const router = useRouter()
const id = route.params.id

// Charger les données de l'utilisateur
user.value = await $fetch(`/api/users/${id}`)

// Fonction pour modifier l'utilisateur
async function updateUser() {
  try {
    await fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: {
          firstname: user.value.name.firstname,
          lastname: user.value.name.lastname
        },
        email: user.value.email,
        phone: user.value.phone
      })
    })

    alert('Utilisateur modifié avec succès !')
    router.push('/admin/users') // Redirection après succès
  } catch (error) {
    alert("Erreur lors de la modification")
    console.error(error)
  }
}
</script>


