<template>
  <div class="max-w-xl mx-auto p-6 bg-white rounded-xl shadow mt-10">
    <h2 class="text-2xl font-bold mb-4 text-gray-800">Modifier le produit #{{ productId }}</h2>

    <div v-if="pending" class="text-center text-gray-500 italic">Chargement du produit…</div>
    <div v-else-if="error" class="text-center text-red-600 font-semibold">Erreur : {{ error.message }}</div>

    <form v-else @submit.prevent="updateProduct" class="space-y-4">
      <input
        v-model="form.title"
        type="text"
        placeholder="Titre"
        class="w-full p-2 border rounded"
        required
      />
      <textarea
        v-model="form.description"
        placeholder="Description"
        class="w-full p-2 border rounded"
        required
      ></textarea>
      <input
        v-model.number="form.price"
        type="number"
        placeholder="Prix"
        class="w-full p-2 border rounded"
        required
      />
      <input
        v-model="form.image"
        type="url"
        placeholder="URL image"
        class="w-full p-2 border rounded"
        required
      />
      <select v-model="form.category" class="w-full p-2 border rounded" required>
        <option disabled value="">Choisir une catégorie</option>
        <option>electronics</option>
        <option>jewelery</option>
        <option>men's clothing</option>
        <option>women's clothing</option>
      </select>

      <button
        type="submit"
        class="w-full bg-gray-900 text-white py-2 rounded hover:bg-green-600 transition"
      >
        💾 Enregistrer les modifications
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const productId = route.params.id

// Chargement du produit
const { data: product, pending, error } = await useAsyncData(`product-${productId}`, () =>
  $fetch(`/api/products/${productId}`)
)

// Formulaire local
const form = ref({
  title: '',
  description: '',
  price: 0,
  image: '',
  category: ''
})

// Synchroniser les données chargées
watch(product, (p) => {
  if (p) {
    form.value = { ...p }
  }
})

// Mettre à jour le produit
async function updateProduct() {
  try {
    await $fetch(`/api/products/${productId}`, {
      method: 'PUT',
      body: form.value
    })

    alert('✅ Produit mis à jour avec succès !')
    router.push('/products')
  } catch (err) {
    alert('❌ Erreur lors de la mise à jour')
    console.error(err)
  }
}
</script>

