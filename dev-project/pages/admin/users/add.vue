<template>
  <!-- Conteneur principal avec un fond clair ou sombre selon le mode -->
  <div class="p-4 bg-white dark:bg-gray-900 shadow-md sticky top-0 z-10">

    <!-- SECTION : Bouton Retour vers la page des utilisateurs -->
    <div class="p-4 bg-white dark:bg-gray-900 shadow-md sticky top-0 z-10">
      <!-- Lien Nuxt qui redirige vers /admin/users -->
      <NuxtLink to="/admin/users">
        <button
          class="inline-flex items-center text-sm font-semibold text-gray-700 dark:text-green-600 border border-gray-300 dark:border-green-600 rounded-xl px-4 py-2 bg-white dark:bg-gray-800 hover:bg-green-600 hover:text-white transition"
        >
          <i class="fa-solid fa-arrow-left mr-2"></i> Retour
        </button>
      </NuxtLink>
    </div>

    <!-- SECTION : Formulaire d'ajout d'utilisateur -->
    <div class="max-w-lg mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow mt-10">
      <!-- Titre du formulaire -->
      <h2 class="text-2xl font-bold mb-6 text-gray-800 dark:text-green-600 flex items-center gap-2">
        <i class="fas fa-user-plus text-green-600"></i> Ajouter un utilisateur
      </h2>

      <!-- Formulaire avec liaison de chaque champ avec un modèle `form` -->
      <form @submit.prevent="ajouterUser" class="space-y-4">

        <!-- Champ Prénom -->
        <label class="block text-gray-700 dark:text-green-400 font-semibold">
          <i class="fas fa-user mr-2"></i> Prénom
          <input
            v-model="form.firstname"
            type="text"
            placeholder="Prénom"
            class="w-full mt-1 p-2 border border-gray-300 dark:border-green-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-green-300"
            required
          />
        </label>

        <!-- Champ Nom -->
        <label class="block text-gray-700 dark:text-green-400 font-semibold">
          <i class="fas fa-user mr-2"></i> Nom
          <input
            v-model="form.lastname"
            type="text"
            placeholder="Nom"
            class="w-full mt-1 p-2 border border-gray-300 dark:border-green-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-green-300"
            required
          />
        </label>

        <!-- Champ Email -->
        <label class="block text-gray-700 dark:text-green-400 font-semibold">
          <i class="fas fa-envelope mr-2"></i> Email
          <input
            v-model="form.email"
            type="email"
            placeholder="Adresse email"
            class="w-full mt-1 p-2 border border-gray-300 dark:border-green-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-green-300"
            required
          />
        </label>

        <!-- Champ Nom d'utilisateur -->
        <label class="block text-gray-700 dark:text-green-400 font-semibold">
          <i class="fas fa-user-circle mr-2"></i> Nom d'utilisateur
          <input
            v-model="form.username"
            type="text"
            placeholder="Nom d'utilisateur"
            class="w-full mt-1 p-2 border border-gray-300 dark:border-green-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-green-300"
            required
          />
        </label>

        <!-- Champ Téléphone -->
        <label class="block text-gray-700 dark:text-green-400 font-semibold">
          <i class="fas fa-phone mr-2"></i> Téléphone
          <input
            v-model="form.phone"
            type="tel"
            placeholder="Téléphone"
            class="w-full mt-1 p-2 border border-gray-300 dark:border-green-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-green-300"
          />
        </label>

        <!-- Champ Adresse -->
        <label class="block text-gray-700 dark:text-green-400 font-semibold">
          <i class="fas fa-map-marker-alt mr-2"></i> Adresse
          <textarea
            v-model="form.address"
            placeholder="Adresse complète (optionnel)"
            class="w-full mt-1 p-2 border border-gray-300 dark:border-green-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-green-300"
            rows="3"
          ></textarea>
        </label>

        <!-- Champ Rôle (sélecteur de rôle) -->
        <label class="block text-gray-700 dark:text-green-400 font-semibold">
          <i class="fas fa-user-tag mr-2"></i> Rôle
          <select
            v-model="form.role"
            class="w-full mt-1 p-2 border border-gray-300 dark:border-green-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-green-300"
            required
          >
            <option disabled value="">Choisir un rôle</option>
            <option>admin</option>
            <option>user</option>
            <option>moderator</option>
          </select>
        </label>

        <!-- Bouton de soumission -->
        <button
          type="submit"
          class="w-full bg-gray-400 dark:bg-green-600 text-white py-2 rounded hover:bg-green-600 dark:hover:bg-green-700 transition flex items-center justify-center gap-2"
        >
          <i class="fas fa-plus"></i> Ajouter l'utilisateur
        </button>
      </form>

      <!-- Message de succès ou d'erreur après soumission -->
      <div
        v-if="message"
        :class="messageClass"
        class="mt-4 p-2 rounded text-center font-semibold"
      >
        {{ message }}
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue' // Pour déclarer des variables réactives
import { useRouter } from 'vue-router' // Pour rediriger l'utilisateur après soumission

const router = useRouter() // On initialise le routeur

// On crée un objet "form" avec tous les champs du formulaire
const form = ref({
  firstname: '',
  lastname: '',
  email: '',
  username: '',
  password: '',
  phone: '',
  address: '',
  role: ''
})

// Variable pour afficher un message (succès ou erreur)
const message = ref('')
const messageClass = ref('')

// Fonction qui envoie les infos du formulaire à l'API
async function ajouterUser() {
  try {
    // Requête POST vers notre API pour enregistrer l'utilisateur
    await $fetch('/api/users', {
      method: 'POST',
      body: form.value
    })

    // Si tout se passe bien, on affiche un message de succès
    message.value = "Utilisateur ajouté avec succès !"
    messageClass.value = "bg-green-200 text-green-800 dark:bg-green-700 dark:text-green-100"

    // Puis on redirige vers la liste des utilisateurs après 2s
    setTimeout(() => {
      router.push('/admin/users')
    }, 2000)
  } catch (err) {
    // En cas d'erreur, on affiche un message d'erreur
    message.value = "Erreur lors de l'ajout de l'utilisateur."
    messageClass.value = "bg-red-200 text-red-800 dark:bg-red-700 dark:text-red-100"
    console.error(err)
  }
}
</script>
