<template> 
  <!-- Bouton Retour -->
  <div class="p-4 bg-white shadow-md sticky top-0 z-10">
    <NuxtLink to="/admin/products">
      <button
        class="inline-flex items-center text-sm font-semibold text-gray-700 border rounded-xl px-4 py-2 bg-white hover:bg-green-600 transition"
      >
        <i class="fa-solid fa-arrow-left mr-2"></i> Retour
      </button>
    </NuxtLink>
  </div>
 <section class="p-6 bg-gray-50 min-h-screen">

  <div class="max-w-xl mx-auto p-6 bg-white rounded-xl shadow mt-10">
    <h2 class="text-2xl font-bold mb-4 text-gray-800">
      <i class="fa-solid fa-box-open text-green-600 mr-2"></i>
      Ajouter un produit
    </h2>

    <form @submit.prevent="ajouterProduit" class="space-y-4">
      <!-- Titre -->
      <div class="relative">
        <i class="fa-solid fa-tag absolute left-3 top-3 text-gray-400"></i>
        <input
          v-model="form.title"
          type="text"
          placeholder="Nom du produit"
          class="w-full p-2 pl-10 border rounded"
          required
        />
      </div>

      <!-- Description -->
      <div class="relative">
        <i class="fa-solid fa-align-left absolute left-3 top-3 text-gray-400"></i>
        <textarea
          v-model="form.description"
          placeholder="Description"
          class="w-full p-2 pl-10 border rounded"
          required
        ></textarea>
      </div>

      <!-- Prix -->
      <div class="relative">
        <i class="fa-solid fa-dollar-sign absolute left-3 top-3 text-gray-400"></i>
        <input
          v-model.number="form.price"
          type="number"
          placeholder="Prix"
          class="w-full p-2 pl-10 border rounded"
          required
        />
      </div>

      <!-- Image -->
      <div class="relative">
        <i class="fa-solid fa-image absolute left-3 top-3 text-gray-400"></i>
        <input
          v-model="form.image"
          type="url"
          placeholder="URL de l’image"
          class="w-full p-2 pl-10 border rounded"
          required
        />
      </div>

      <!-- Catégorie -->
      <div class="relative">
        <i class="fa-solid fa-list absolute left-3 top-3.5 text-gray-400"></i>
        <select v-model="form.category" class="w-full p-2 pl-10 border rounded" required>
          <option disabled value="">Choisir une catégorie</option>
          <option>electronics</option>
          <option>jewelery</option>
          <option>men's clothing</option>
          <option>women's clothing</option>
        </select>
      </div>

      <!-- Bouton Ajouter -->
      <button type="submit" class="w-full bg-gray-900 text-white py-2 rounded hover:bg-green-600">
        <i class="fa-solid fa-plus mr-2"></i>
        Ajouter
      </button>
    </form>

    <div v-if="message" class="mt-4 text-green-600 font-semibold flex items-center gap-2">
      <i class="fa-solid fa-check-circle"></i>
      {{ message }}
    </div>
  </div>
  </section>
</template>


<script setup>
import { ref } from 'vue'

const form = ref({
  title: '',
  price: 0,
  description: '',
  image: '',
  category: ''
})

const message = ref('')

async function ajouterProduit() {
  try {
    await $fetch('/api/products', {
      method: 'POST',
      body: form.value
    })
    message.value = 'Produit ajouté avec succès !'
    form.value = {
      title: '',
      price: 0,
      description: '',
      image: '',
      category: ''
    }
  } catch (error) {
    message.value = 'Erreur lors de l’ajout du produit.'
    console.error(error)
  }
}
</script>
