<template>
  <div class="max-w-lg mx-auto p-6 bg-white rounded-xl shadow mt-10">
    <h2 class="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
      <i class="fas fa-user-plus text-green-600"></i> Ajouter un utilisateur
    </h2>

    <form @submit.prevent="ajouterUser" class="space-y-4">

      <label class="block text-gray-700 font-semibold">
        <i class="fas fa-user mr-2"></i> Prénom
        <input
          v-model="form.firstname"
          type="text"
          placeholder="Prénom"
          class="w-full mt-1 p-2 border rounded"
          required
        />
      </label>

      <label class="block text-gray-700 font-semibold">
        <i class="fas fa-user mr-2"></i> Nom
        <input
          v-model="form.lastname"
          type="text"
          placeholder="Nom"
          class="w-full mt-1 p-2 border rounded"
          required
        />
      </label>

      <label class="block text-gray-700 font-semibold">
        <i class="fas fa-envelope mr-2"></i> Email
        <input
          v-model="form.email"
          type="email"
          placeholder="Adresse email"
          class="w-full mt-1 p-2 border rounded"
          required
        />
      </label>

      <label class="block text-gray-700 font-semibold">
        <i class="fas fa-user-circle mr-2"></i> Nom d'utilisateur
        <input
          v-model="form.username"
          type="text"
          placeholder="Nom d'utilisateur"
          class="w-full mt-1 p-2 border rounded"
          required
        />
      </label>

      <label class="block text-gray-700 font-semibold">
        <i class="fas fa-phone mr-2"></i> Téléphone
        <input
          v-model="form.phone"
          type="tel"
          placeholder="Téléphone"
          class="w-full mt-1 p-2 border rounded"
        />
      </label>

      <label class="block text-gray-700 font-semibold">
        <i class="fas fa-map-marker-alt mr-2"></i> Adresse
        <textarea
          v-model="form.address"
          placeholder="Adresse complète (optionnel)"
          class="w-full mt-1 p-2 border rounded"
          rows="3"
        ></textarea>
      </label>

      <label class="block text-gray-700 font-semibold">
        <i class="fas fa-user-tag mr-2"></i> Rôle
        <select
          v-model="form.role"
          class="w-full mt-1 p-2 border rounded"
          required
        >
          <option disabled value="">Choisir un rôle</option>
          <option>admin</option>
          <option>user</option>
          <option>moderator</option>
        </select>
      </label>

      <button
        type="submit"
        class="w-full bg-gray-900 text-white py-2 rounded hover:bg-green-600 transition flex items-center justify-center gap-2"
      >
        <i class="fas fa-plus"></i> Ajouter l'utilisateur
      </button>
    </form>

    <div
      v-if="message"
      :class="messageClass"
      class="mt-4 p-2 rounded text-center font-semibold"
    >
      {{ message }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

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

const message = ref('')
const messageClass = ref('')

async function ajouterUser() {
  try {
    await $fetch('/api/users', {
      method: 'POST',
      body: form.value
    })

    message.value = "Utilisateur ajouté avec succès !"
    messageClass.value = "bg-green-200 text-green-800"

    setTimeout(() => {
      router.push('/admin/users')
    }, 2000)
  } catch (err) {
    message.value = "Erreur lors de l'ajout de l'utilisateur."
    messageClass.value = "bg-red-200 text-red-800"
    console.error(err)
  }
}
</script>
