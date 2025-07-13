<!-- 
<template>
  <NuxtLink :to="`/users`">
    <button class="inline-block text-xs text-white mb-4 border rounded-xl px-4 py-2 bg-gray-900 hover:bg-gray-800 transition">
      ← Annuler
    </button>
  </NuxtLink>

  <section class="p-6 bg-gray-100 min-h-screen font-sans">
    <div v-if="user && editedUser" class="max-w-xl mx-auto bg-white p-6 rounded-xl shadow space-y-6">
      <h2 class="text-2xl font-bold text-gray-800 mb-4 text-center">
        ✏️ Modifier l'utilisateur #{{ user.value.id }}
      </h2>

      <form @submit.prevent="updateUser" class="space-y-4">
        <div>
          <label class="block mb-1 text-sm font-medium">Prénom</label>
          <input v-model="editedUser.name.firstname" class="w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label class="block mb-1 text-sm font-medium">Nom</label>
          <input v-model="editedUser.name.lastname" class="w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label class="block mb-1 text-sm font-medium">Email</label>
          <input v-model="editedUser.email" class="w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label class="block mb-1 text-sm font-medium">Téléphone</label>
          <input v-model="editedUser.phone" class="w-full border rounded px-3 py-2" />
        </div>

        <button
          type="submit"
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Enregistrer les modifications
        </button>
      </form>
    </div>

    <div v-else-if="pending" class="text-center text-gray-500 italic">
      Chargement de l'utilisateur…
    </div>

    <div v-else-if="error" class="text-center text-red-600 font-semibold">
      Erreur lors du chargement : {{ error.message }}
    </div>
  </section>
</template>
<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const id = route.params.id

const { data: user, pending, error } = await useAsyncData(`user-${id}`, () =>
  $fetch(`/api/users/${id}`)
)

const editedUser = ref({
  name: { firstname: '', lastname: '' },
  email: '',
  phone: ''
})

watch(user, (newUser) => {
  if (newUser) {
    editedUser.value = JSON.parse(JSON.stringify(newUser))
  }
})

async function updateUser() {
  try {
    await $fetch(`/api/users/${id}`, {
      method: 'PUT',
      body: editedUser.value
    })
    alert('Utilisateur modifié avec succès !')
    router.push('/users')
  } catch (err) {
    alert("Erreur lors de la modification")
    console.error(err)
  }
}
</script> -->


<template>
  <!-- Bouton Retour -->
  <div class="p-4 bg-white shadow-md sticky top-0 z-10">
    <NuxtLink to="`/users/${user.id}`">
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
    router.push('/users') // Redirection après succès
  } catch (error) {
    alert("Erreur lors de la modification")
    console.error(error)
  }
}
</script>


