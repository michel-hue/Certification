<template>
  <div class="space-y-4">
    <!-- Champs du formulaire avec v-model pour récupérer les valeurs -->
    <input v-model="firstname" type="text" placeholder="Prénom" class="input-field" />
    <input v-model="lastname" type="text" placeholder="Nom" class="input-field" />
    <input v-model="email" type="email" placeholder="Email" class="input-field" />
    <input v-model="username" type="text" placeholder="Nom d’utilisateur" class="input-field" />
    <input v-model="password" type="password" placeholder="Mot de passe" class="input-field" />
    <input v-model="phone" type="tel" placeholder="Téléphone" class="input-field" />

    <!-- Bouton pour soumettre la création du compte -->
    <button
      @click.prevent="register" <!-- On empêche le submit par défaut et on appelle register -->
      class="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-xl transition hover:scale-105 duration-300"
    >
      <i class="fas fa-user-plus mr-2 animate-pulse"></i> <!-- Icône avec animation -->
      Créer un compte
    </button>

    <!-- Lien pour aller vers la page de connexion -->
    <p class="text-sm text-center text-gray-600 dark:text-gray-400 mt-4">
      Déjà un compte ?
      <NuxtLink
        :to="`/users/auth/login`"
        class="text-green-600 dark:text-green-400 hover:underline font-medium"
      >
        Se connecter
      </NuxtLink>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'        // On importe ref pour gérer les variables réactives
import { useRouter } from 'vue-router'  // Pour rediriger après inscription

const router = useRouter()

// Déclaration des variables réactives pour chaque champ du formulaire
const firstname = ref('')
const lastname = ref('')
const email = ref('')
const username = ref('')
const password = ref('')
const phone = ref('')

// Fonction qui s'exécute au clic sur le bouton pour créer un utilisateur
const register = async () => {
  try {
    // On crée un objet user avec les infos remplies dans le formulaire
    const newUser = {
      email: email.value,
      username: username.value,
      name: {
        firstname: firstname.value,
        lastname: lastname.value
      },
      password: password.value,
      phone: phone.value
    }

    // On envoie les données avec une requête POST vers l'API fakestore
    const result = await $fetch('https://fakestoreapi.com/users', {
      method: 'POST',
      body: newUser
    })

    // Si ça marche, on affiche une alerte de succès
    alert('✅ Utilisateur créé avec succès !')

    // On vide les champs pour que ce soit propre après inscription
    firstname.value = ''
    lastname.value = ''
    email.value = ''
    username.value = ''
    password.value = ''
    phone.value = ''

    // On redirige vers la page principale des utilisateurs
    router.push('/users')
  } catch (err) {
    // En cas d'erreur, on affiche un message dans la console et une alerte pour l'utilisateur
    console.error(err)
    alert('❌ Erreur lors de la création du compte.')
  }
}
</script>

<style scoped>
/* Style des champs input avec Tailwind via @apply */
/* On met en forme les inputs avec bordure, arrondis, padding et focus */
.input-field {
  @apply w-full border rounded-xl px-4 py-2 transition focus:ring-2 focus:ring-green-500;
  @apply bg-white text-gray-900 placeholder-gray-500 border-gray-300;
  @apply dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:border-gray-600;
}
</style>
