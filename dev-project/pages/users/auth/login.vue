<template>
  <!-- Section pleine hauteur avec image de fond -->
  <section class="relative min-h-screen flex items-center justify-start bg-gray-900">

    <!-- Image de fond (affichée complètement quelle que soit sa taille) -->
    <img 
      src="/images/fonds.jpg" 
      alt="Image de fond" 
      class="absolute inset-0 w-full h-full object-contain"
    />

    <!-- Overlay sombre -->
    <div class="absolute inset-0 bg-black bg-opacity-60 z-0"></div>

    <!-- Bouton retour placé en haut à gauche -->
    <div class="absolute top-4 left-4 z-20">
      <NuxtLink
        to="/"
        class="inline-block text-sm text-white bg-gray-900 px-4 py-2 rounded-xl hover:bg-green-600 transition"
      >
        ← Retour
      </NuxtLink>
    </div>

    <!-- Formulaire à gauche -->
    <div class="relative bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md ml-10 z-10">
      <h1 class="text-2xl font-bold text-center text-gray-800 dark:text-white">Connexion</h1>

      <!-- Champ nom d'utilisateur -->
      <div class="mt-6">
        <label for="username" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Nom d'utilisateur
        </label>
        <div class="relative">
          <i class="fas fa-user absolute left-3 top-3 text-gray-500 dark:text-gray-300"></i>
          <input
            type="text"
            id="username"
            v-model="username"
            class="pl-10 mt-1 block w-full px-4 py-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring focus:ring-green-600 focus:outline-none"
          />
        </div>
      </div>

      <!-- Champ mot de passe -->
      <div class="mt-4">
        <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Mot de passe
        </label>
        <div class="relative">
          <i class="fas fa-lock absolute left-3 top-3 text-gray-500 dark:text-gray-300"></i>
          <input
            type="password"
            id="password"
            v-model="password"
            class="pl-10 mt-1 block w-full px-4 py-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring focus:ring-green-600 focus:outline-none"
          />
        </div>
      </div>

      <!-- Message d'erreur -->
      <p v-if="erreur" class="text-red-500 text-sm text-center mt-2">{{ erreur }}</p>

      <!-- Bouton de connexion -->
      <div class="mt-6">
        <button
          @click="login"
          class="w-full flex items-center justify-center bg-gray-900 hover:bg-green-600 text-white py-2 px-4 rounded-full border-2 border-green-600 transition"
        >
          <i class="fas fa-sign-in-alt mr-2 animate-pulse"></i>
          Se connecter
        </button>
      </div>
    </div>
  </section>
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

  try {
    const res = await $fetch('https://fakestoreapi.com/auth/login', {
      method: 'POST',
      body: {
        username: username.value,
        password: password.value
      }
    })

    if (res && res.token) {
      localStorage.setItem('token', res.token)

      const users = await $fetch('https://fakestoreapi.com/users')
      const user = users.find((u: any) => u.username === username.value)

      if (user) {
        localStorage.setItem('userId', user.id)
        localStorage.setItem('username', user.username)
        router.push('/users/users/dashboard')
      } else {
        erreur.value = "Utilisateur non trouvé."
      }
    } else {
      erreur.value = "Connexion échouée. Vérifiez vos identifiants."
    }
  } catch (e) {
    erreur.value = "Erreur lors de la connexion. Réessayez plus tard."
  }
}
</script>
