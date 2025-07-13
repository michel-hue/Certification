<template>
  <section class="min-h-screen bg-gray-100 flex items-center justify-center px-4">
    <div class="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
      <h2 class="text-2xl font-bold text-center text-gray-800 mb-6 flex items-center justify-center gap-2">
        <i class="fa-solid fa-right-to-bracket text-green-600 text-xl"></i>
        Connexion
      </h2>

      <p v-if="erreur" class="text-red-600 text-sm mb-4 text-center">
        {{ erreur }}
      </p>

      <form @submit.prevent="seConnecter" class="space-y-5">
        <!-- Nom d'utilisateur -->
        <div>
          <label class="block mb-1 font-medium text-gray-700">Nom d'utilisateur</label>
          <div class="flex items-center border rounded-xl px-3 bg-gray-50 focus-within:ring-2 focus-within:ring-green-600">
            <i class="fa-solid fa-user text-gray-400 mr-2"></i>
            <input
              v-model="username"
              type="text"
              placeholder="john"
              class="w-full bg-transparent py-2 outline-none"
              required
            />
          </div>
        </div>

        <!-- Mot de passe -->
        <div>
          <label class="block mb-1 font-medium text-gray-700">Mot de passe</label>
          <div class="flex items-center border rounded-xl px-3 bg-gray-50 focus-within:ring-2 focus-within:ring-green-600">
            <i class="fa-solid fa-lock text-gray-400 mr-2"></i>
            <input
              v-model="password"
              type="password"
              placeholder="123456"
              class="w-full bg-transparent py-2 outline-none"
              required
            />
          </div>
        </div>

        <!-- Bouton -->
        <button
          type="submit"
          class="w-full bg-gray-900 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-xl transition"
        >
          <i class="fa-solid fa-arrow-right-to-bracket mr-2"></i>
          Se connecter
        </button>
      </form>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const erreur = ref('')
const router = useRouter()

// Connexion avec FakeStoreAPI
const seConnecter = async () => {
  try {
    const res = await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        username: username.value,
        password: password.value
      }
    })

    if (res.token) {
      localStorage.setItem('token', res.token)
      router.push('/')
    } else {
      erreur.value = "Échec de la connexion."
    }
  } catch (e) {
    erreur.value = "Identifiants incorrects ou erreur réseau."
  }
}

</script>
