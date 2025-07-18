<template>
  <!-- Bouton pour retourner à la page d'accueil -->
  <NuxtLink to="/" class="inline-block text-sm text-white mb-4 bg-gray-900 px-4 py-2 rounded-xl hover:bg-green-600 transition">
    ← Retour
  </NuxtLink>

  <!-- Formulaire de connexion -->
  <section class="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
    <div class="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md space-y-6">
      <h1 class="text-2xl font-bold text-center text-gray-800 dark:text-white">Connexion</h1>

      <!-- Champ pour le nom d'utilisateur -->
      <div>
        <label for="username" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nom d'utilisateur</label>
        <input type="text" id="username" v-model="username" class="mt-1 block w-full px-4 py-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring focus:ring-green-600 focus:outline-none" />
      </div>

      <!-- Champ pour le mot de passe -->
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Mot de passe</label>
        <input type="password" id="password" v-model="password" class="mt-1 block w-full px-4 py-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring focus:ring-green-600 focus:outline-none" />
      </div>

      <!-- Affichage de l'erreur s'il y en a une -->
      <p v-if="erreur" class="text-red-500 text-sm text-center">{{ erreur }}</p>

      <!-- Bouton de connexion -->
      <div>
        <button @click="login" class="w-full bg-gray-900 hover:bg-green-600 text-white py-2 px-4 rounded-md transition">Se connecter</button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
//  Importation des outils nécessaires depuis Vue et Vue Router
import { ref } from 'vue'
import { useRouter } from 'vue-router'

//  Variables pour stocker les données de l'utilisateur
const username = ref('')
const password = ref('')
const erreur = ref('')
const router = useRouter()

//  Fonction appelée quand l'utilisateur clique sur "Se connecter"
async function login() {
  erreur.value = '' // On vide l'erreur à chaque tentative

  try {
    //  Requête pour vérifier les identifiants (POST vers l'API FakeStore)
    const res = await $fetch('https://fakestoreapi.com/auth/login', {
      method: 'POST',
      body: {
        username: username.value,
        password: password.value
      }
    })

    //  Si un token est retourné, cela veut dire que la connexion a fonctionné
    if (res && res.token) {
      localStorage.setItem('token', res.token) // On stocke le token

      //  Récupération de tous les utilisateurs
      const users = await $fetch('https://fakestoreapi.com/users')
      const user = users.find((u: any) => u.username === username.value)

      //  On garde l'identifiant et le nom de l'utilisateur pour l'utiliser plus tard
      if (user) {
        localStorage.setItem('userId', user.id)
        localStorage.setItem('username', user.username)
        router.push('/users/users/dashboard') //  Redirection vers le tableau de bord
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
