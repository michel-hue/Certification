<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <!-- Retour -->
    <NuxtLink :to="'/users/users/dashboard'" class="inline-flex items-center mb-6 text-sm font-semibold text-gray-700 border rounded-xl px-4 py-2 bg-white hover:bg-green-600 hover:text-white transition">
      <i class="fas fa-arrow-left mr-2"></i> Retour
    </NuxtLink>

    <div class="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-lg">
      <h1 class="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <i class="fas fa-edit text-blue-600"></i> Modifier mes informations
      </h1>

      <form @submit.prevent="updateUser" class="space-y-4">
        <input v-model="firstname" type="text" placeholder="Prénom" class="w-full border px-4 py-2 rounded-xl" required />
        <input v-model="lastname" type="text" placeholder="Nom" class="w-full border px-4 py-2 rounded-xl" required />
        <input v-model="email" type="email" placeholder="Email" class="w-full border px-4 py-2 rounded-xl" required />
        <input v-model="phone" type="tel" placeholder="Téléphone" class="w-full border px-4 py-2 rounded-xl" required />
        <input v-model="username" type="text" placeholder="Nom d’utilisateur" class="w-full border px-4 py-2 rounded-xl" required />

        <button type="submit" class="w-full bg-gray-900 hover:bg-green-600 text-white py-2 rounded-xl transition">
          <i class="fas fa-save mr-2"></i> Enregistrer
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const id = route.params.id

const firstname = ref('')
const lastname = ref('')
const email = ref('')
const phone = ref('')
const username = ref('')

// Charger les infos actuelles
onMounted(async () => {
  try {
    const userData = await $fetch(`https://fakestoreapi.com/users/${id}`)
    firstname.value = userData.name.firstname
    lastname.value = userData.name.lastname
    email.value = userData.email
    phone.value = userData.phone
    username.value = userData.username
  } catch (err) {
    alert('Erreur lors du chargement des données utilisateur.')
    console.error(err)
  }
})

// Mettre à jour l'utilisateur
const updateUser = async () => {
  try {
    const updatedUser = {
      email: email.value,
      username: username.value,
      name: {
        firstname: firstname.value,
        lastname: lastname.value
      },
      phone: phone.value
    }

    await $fetch(`https://fakestoreapi.com/users/${id}`, {
      method: 'PUT',
      body: updatedUser
    })

    alert('✅ Informations mises à jour avec succès.')
    router.push('/users/users/dashboard')
  } catch (err) {
    console.error(err)
    alert('❌ Une erreur est survenue.')
  }
}
</script>
