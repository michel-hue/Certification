<template>
  <!-- Bouton Retour -->
  <div class="p-4 bg-white dark:bg-gray-900 shadow-md sticky top-0 z-10">
    <NuxtLink :to="`/admin/products/${productId}`">
      <button
        class="inline-flex items-center text-sm font-semibold text-gray-700 dark:text-green-600 border border-gray-300 dark:border-green-600 rounded-xl px-4 py-2 bg-white dark:bg-gray-800 hover:bg-green-600 hover:text-white transition"
      >
        <i class="fa-solid fa-arrow-left mr-2"></i> Retour
      </button>
    </NuxtLink>
  </div>

  <section class="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen font-sans">
    <div
      v-if="product"
      class="max-w-xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-xl shadow space-y-6"
    >
      <h2 class="text-2xl font-bold text-gray-800 dark:text-green-600 mb-4 text-center">
        🛠️ Modifier le produit #{{ productId }}
      </h2>

      <form @submit.prevent="updateProduct" class="space-y-4">
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700 dark:text-green-600">Titre</label>
          <input
            v-model="form.title"
            type="text"
            class="w-full p-2 border border-gray-300 dark:border-green-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-green-300"
            required
          />
        </div>

        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700 dark:text-green-600">Description</label>
          <textarea
            v-model="form.description"
            class="w-full p-2 border border-gray-300 dark:border-green-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-green-300"
            required
          ></textarea>
        </div>

        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700 dark:text-green-600">Prix</label>
          <input
            v-model.number="form.price"
            type="number"
            class="w-full p-2 border border-gray-300 dark:border-green-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-green-300"
            required
          />
        </div>

        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700 dark:text-green-600">Image (URL)</label>
          <input
            v-model="form.image"
            type="url"
            class="w-full p-2 border border-gray-300 dark:border-green-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-green-300"
            required
          />
        </div>

        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700 dark:text-green-600">Catégorie</label>
          <select
            v-model="form.category"
            class="w-full p-2 border border-gray-300 dark:border-green-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-green-300"
            required
          >
            <option disabled value="">Choisir une catégorie</option>
            <option>electronics</option>
            <option>jewelery</option>
            <option>men's clothing</option>
            <option>women's clothing</option>
          </select>
        </div>

        <button
          type="submit"
          class="w-full bg-gray-900 dark:bg-green-600 text-white py-2 rounded hover:bg-green-600 dark:hover:bg-green-700 transition flex items-center justify-center gap-2"
        >
          <i class="fa-solid fa-floppy-disk"></i> Enregistrer les modifications
        </button>
      </form>
    </div>

    <div v-else-if="pending" class="text-center text-gray-500 dark:text-gray-400 italic">
      Chargement du produit…
    </div>

    <div v-else-if="error" class="text-center text-red-600 dark:text-red-400 font-semibold">
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
