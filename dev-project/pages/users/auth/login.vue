<template>
      <!-- Bouton retour -->
    <NuxtLink
      to="/"
      class="inline-flex items-center mb-6 text-sm font-semibold text-gray-700 border rounded-xl px-4 py-2 bg-white hover:bg-green-600 hover:text-white transition"
    >
      <i class="fas fa-arrow-left mr-2"></i>
      Retour
    </NuxtLink>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center p-6">
    <div class="w-full max-w-md bg-white p-6 rounded-xl shadow-lg">
      <h1 class="text-2xl font-bold text-center text-gray-800 mb-6">
        Connexion
      </h1>

      <form @submit.prevent="login">
        <div class="mb-4">
          <label for="username" class="block text-sm font-medium text-gray-700"> <i class="fas fa-user"></i>Nom d’utilisateur</label>
          <input
            id="username"
            v-model="username"
            type="text"
            required
            class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-green-600 focus:border-green-600"
          />
        </div>

        <div class="mb-6">
          <label for="password" class="block text-sm font-medium text-gray-700">Mot de passe</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-green-600 focus:border-green-600"
          />
        </div>

        <div v-if="erreur" class="text-red-600 text-sm mb-4">
          {{ erreur }}
        </div>

        <button
          type="submit"
          class="w-full bg-gray-900 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md transition"
        >
          Se connecter
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const erreur = ref('')
const router = useRouter()

async function login() {
  erreur.value = ''

  const credentials = { username: username.value, password: password.value }

  try {
    const response = await fetch('https://fakestoreapi.com/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    })

    if (!response.ok) {
      erreur.value = `Erreur HTTP : ${response.status}`
      return
    }

    const data = await response.json()

    if (data.token) {
      // ✅ Stocker le token
      localStorage.setItem('token', data.token)

      // 🔍 Rechercher le user par son nom d’utilisateur pour récupérer son ID
      const users = await $fetch('https://fakestoreapi.com/users')
      const currentUser = users.find(u => u.username === username.value)

      if (currentUser) {
        localStorage.setItem('userId', currentUser.id)
        localStorage.setItem('username', currentUser.username)

        // ✅ Rediriger vers le dashboard
        router.push('/users/users/dashboard')
      } else {
        erreur.value = 'Utilisateur introuvable.'
      }
    } else if (data.msg) {
      erreur.value = data.msg
    } else {
      erreur.value = 'Réponse inattendue du serveur.'
    }
  } catch (err) {
    erreur.value = 'Erreur réseau ou serveur : ' + err
    console.error(err)
  }
}
</script>
