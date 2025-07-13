<template>
  <section class="min-h-screen bg-gray-100 flex flex-col">
    <!-- Titre principal -->
    <h2 class="text-3xl font-bold text-center text-gray-800 py-8">
      Créer un nouveau compte
    </h2>

    <!-- Contenu en deux colonnes -->
    <div class="flex flex-col md:flex-row bg-white rounded-xl shadow-lg mx-auto w-full max-w-5xl overflow-hidden">
      <!-- Formulaire à gauche -->
      <div class="md:w-1/2 p-8">
        <!-- Message d'erreur -->
        <p v-if="erreur" class="text-red-600 text-sm mb-4 text-center">
          {{ erreur }}
        </p>

        <form @submit.prevent="sInscrire" class="space-y-5">
          <!-- Nom -->
          <div>
            <label class="block text-sm font-medium mb-1">Nom</label>
            <div class="flex items-center border rounded-xl px-3 bg-gray-50 focus-within:ring-2 focus-within:ring-green-600">
              <i class="fa-solid fa-user text-gray-400 mr-2"></i>
              <input
                v-model="nom"
                type="text"
                placeholder="Votre nom"
                class="w-full bg-transparent py-2 outline-none"
                required
              />
            </div>
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium mb-1">Adresse email</label>
            <div class="flex items-center border rounded-xl px-3 bg-gray-50 focus-within:ring-2 focus-within:ring-green-600">
              <i class="fa-solid fa-envelope text-gray-400 mr-2"></i>
              <input
                v-model="email"
                type="email"
                placeholder="ex: exemple@mail.com"
                class="w-full bg-transparent py-2 outline-none"
                required
              />
            </div>
          </div>

          <!-- Mot de passe -->
          <div>
            <label class="block text-sm font-medium mb-1">Mot de passe</label>
            <div class="flex items-center border rounded-xl px-3 bg-gray-50 focus-within:ring-2 focus-within:ring-green-600">
              <i class="fa-solid fa-lock text-gray-400 mr-2"></i>
              <input
                v-model="motDePasse"
                type="password"
                placeholder="********"
                class="w-full bg-transparent py-2 outline-none"
                required
              />
            </div>
          </div>

          <!-- Bouton -->
          <button
            type="submit"
            class="w-full bg-gray-900 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition"
          >
            <i class="fa-solid fa-user-plus mr-2"></i> S'inscrire
          </button>

          <!-- Lien vers login -->
          <p class="text-center text-sm text-gray-600">
            Déjà inscrit ?
            <NuxtLink to="/login" class="text-green-600 hover:underline">Se connecter</NuxtLink>
          </p>
        </form>
      </div>

      <!-- Trait vertical -->
      <div class="hidden md:flex w-[1px] bg-gray-300"></div>

      <!-- Section visuelle à droite -->
      <div class="md:w-1/2 bg-gradient-to-br from-green-600 to-gray-900 text-white p-8 flex flex-col justify-center items-center">
        <i class="fa-solid fa-users text-5xl mb-4"></i>
        <h3 class="text-2xl font-semibold mb-2">Bienvenue chez nous !</h3>
        <p class="text-center text-gray-200 text-sm">
          Rejoignez notre communauté et accédez à des milliers de produits de qualité, livrés en un clic.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

// Champs du formulaire
const nom = ref('')
const email = ref('')
const motDePasse = ref('')
const erreur = ref('')
const router = useRouter()

const sInscrire = async () => {
  try {
    await $fetch('/api/users', {
      method: 'POST',
      body: { nom: nom.value, email: email.value, motDePasse: motDePasse.value }
    })
    router.push('/login')
  } catch (e) {
    erreur.value = "Une erreur est survenue lors de l'inscription."
  }
}
</script>
