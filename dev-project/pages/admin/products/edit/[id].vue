<template>
  <!-- Bouton Retour -->
  <div class="p-4 bg-white shadow-md sticky top-0 z-10">
    <NuxtLink :to="`/admin/products/${productId}`">
      <button
        class="inline-flex items-center text-sm font-semibold text-gray-700 border rounded-xl px-4 py-2 bg-white hover:bg-green-600 transition"
      >
        <i class="fa-solid fa-arrow-left mr-2"></i> Retour
      </button>
    </NuxtLink>
  </div>

  <section class="p-6 bg-gray-100 min-h-screen font-sans">
    <div v-if="product" class="max-w-xl mx-auto bg-white p-6 rounded-xl shadow space-y-6">
      <h2 class="text-2xl font-bold text-gray-800 mb-4 text-center">
        🛠️ Modifier le produit #{{ productId }}
      </h2>

      <form @submit.prevent="updateProduct" class="space-y-4">
        <div>
          <label class="block mb-1 text-sm font-medium">Titre</label>
          <input v-model="form.title" type="text" class="w-full p-2 border rounded" required />
        </div>

        <div>
          <label class="block mb-1 text-sm font-medium">Description</label>
          <textarea v-model="form.description" class="w-full p-2 border rounded" required></textarea>
        </div>

        <div>
          <label class="block mb-1 text-sm font-medium">Prix</label>
          <input v-model.number="form.price" type="number" class="w-full p-2 border rounded" required />
        </div>

        <div>
          <label class="block mb-1 text-sm font-medium">Image (URL)</label>
          <input v-model="form.image" type="url" class="w-full p-2 border rounded" required />
        </div>

        <div>
          <label class="block mb-1 text-sm font-medium">Catégorie</label>
          <select v-model="form.category" class="w-full p-2 border rounded" required>
            <option disabled value="">Choisir une catégorie</option>
            <option>electronics</option>
            <option>jewelery</option>
            <option>men's clothing</option>
            <option>women's clothing</option>
          </select>
        </div>

        <button
          type="submit"
          class="w-full bg-gray-900 text-white py-2 rounded hover:bg-green-600 transition flex items-center justify-center gap-2"
        >
          <i class="fa-solid fa-floppy-disk"></i> Enregistrer les modifications
        </button>
      </form>
    </div>

    <div v-else-if="pending" class="text-center text-gray-500 italic">
      Chargement du produit…
    </div>

    <div v-else-if="error" class="text-center text-red-600 font-semibold">
      Erreur : {{ error.message }}
    </div>
  </section>
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

// Synchroniser les données du produit chargé dans le formulaire
watch(product, (p) => {
  if (p) {
    form.value = { ...p }
  }
})

// Mise à jour du produit
async function updateProduct() {
  try {
    await $fetch(`/api/products/${productId}`, {
      method: 'PUT',
      body: form.value
    })

    alert('✅ Produit mis à jour avec succès !')
    router.push('/admin/products')
  } catch (err) {
    alert('❌ Erreur lors de la mise à jour')
    console.error(err)
  }
}
</script>
