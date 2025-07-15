<template>
  <div
    class="w-full max-w-md px-8 space-y-6 ml-[80px] mt-[80px] bg-white p-8 rounded-xl shadow-lg animate-fade-in-up"
  >
    <h2 class="text-2xl font-semibold flex items-center gap-2">
      <i class="fas fa-user-plus text-green-600 animate-bounce-slow"></i>
      Créer un compte
    </h2>

    <p class="text-sm text-gray-600 animate-fade-in text-opacity-70">
      Bienvenue chez <span class="font-bold text-green-700">Ma Boutique</span> 🎉
    </p>

    <input
      v-model="firstname"
      type="text"
      placeholder="Prénom"
      class="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-green-500"
      required
    />
    <input
      v-model="lastname"
      type="text"
      placeholder="Nom"
      class="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-green-500"
      required
    />
    <input
      v-model="email"
      type="email"
      placeholder="Email"
      class="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-green-500"
      required
    />
    <input
      v-model="username"
      type="text"
      placeholder="Nom d’utilisateur"
      class="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-green-500"
      required
    />
    <input
      v-model="phone"
      type="tel"
      placeholder="Téléphone"
      class="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-green-500"
    />

    <button
      @click.prevent="register"
      class="w-full bg-gray-900 hover:bg-green-600 text-white py-2 rounded-xl transition hover:scale-105 duration-300"
    >
      <i class="fas fa-user-plus mr-2 animate-pulse"></i>
      Créer un compte
    </button>

    <p class="text-sm text-center text-gray-600 mt-4 animate-fade-in">
      Déjà un compte ?
      <NuxtLink
        to="/users/auth/login"
        class="text-green-600 hover:underline font-medium"
      >
        Se connecter
      </NuxtLink>
    </p>
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
      phone: phone.value
    }

    const result = await $fetch('https://fakestoreapi.com/users', {
      method: 'POST',
      body: newUser
    })

    alert('✅ Utilisateur créé avec succès !')
    console.log('Utilisateur ajouté :', result)

    // Réinitialisation des champs
    firstname.value = ''
    lastname.value = ''
    email.value = ''
    username.value = ''
    phone.value = ''

    // Redirection vers la page produits utilisateur
    router.push('/users/products')
  } catch (err) {
    console.error(err)
    alert('❌ Erreur lors de la création du compte.')
  }
}
</script>
