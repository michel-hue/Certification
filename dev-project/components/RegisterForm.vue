<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-300 p-7">
    <div
      class="w-full max-w-md bg-white p-6 md:p-8 rounded-2xl shadow-lg animate-fade-in-up"
    >
      <!-- Titre -->
      <h2 class="text-2xl font-semibold flex items-center gap-2 mb-2">
        <i class="fas fa-user-plus text-green-600 animate-bounce-slow"></i>
        Créer un compte
      </h2>

      <p class="text-sm text-gray-600 mb-6">
        Bienvenue chez <span class="font-bold text-green-700">Ma Boutique</span> 🎉
      </p>

      <!-- Champs -->
      <div class="space-y-4">
        <input
          v-model="firstname"
          type="text"
          placeholder="Prénom"
          class="input-field"
          required
        />
        <input
          v-model="lastname"
          type="text"
          placeholder="Nom"
          class="input-field"
          required
        />
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          class="input-field"
          required
        />
        <input
          v-model="username"
          type="text"
          placeholder="Nom d’utilisateur"
          class="input-field"
          required
        />
        <input
          v-model="password"
          type="password"
          placeholder="Mot de passe"
          class="input-field"
          required
        />
        <input
          v-model="phone"
          type="tel"
          placeholder="Téléphone"
          class="input-field"
        />
      </div>

      <!-- Bouton Créer -->
      <button
        @click.prevent="register"
        class="w-full bg-gray-900 hover:bg-green-600 text-white font-semibold py-2 rounded-xl mt-6 transition hover:scale-105 duration-300"
      >
        <i class="fas fa-user-plus mr-2 animate-pulse"></i>
        Créer un compte
      </button>

      <!-- Lien vers login -->
      <p class="text-sm text-center text-gray-600 mt-4">
        Déjà un compte ?
        <NuxtLink
          to="/users/auth/login"
          class="text-green-600 hover:underline font-medium"
        >
          Se connecter
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const firstname = ref('')
const lastname = ref('')
const email = ref('')
const username = ref('')
const password = ref('')
const phone = ref('')

const register = async () => {
  try {
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

    const result = await $fetch('https://fakestoreapi.com/users', {
      method: 'POST',
      body: newUser
    })

    alert('✅ Utilisateur créé avec succès !')

    // Réinitialisation des champs
    firstname.value = ''
    lastname.value = ''
    email.value = ''
    username.value = ''
    password.value = ''
    phone.value = ''

    // Redirection
    router.push('/users/products')
  } catch (err) {
    console.error(err)
    alert('❌ Erreur lors de la création du compte.')
  }
}
</script>

<style scoped>
/* Style réutilisable pour les champs */
.input-field {
  @apply w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-green-500 transition;
}
</style>
