<template>
  <section class="p-6">
    <h2 class="text-2xl font-bold mb-4">Détail du produit</h2>

    <div v-if="error">
      <p class="text-red-500">Erreur : {{ error.message }}</p>
    </div>

    <div v-else-if="pending">
      <p>Chargement...</p>
    </div>

    <div v-else-if="product">
      <div class="bg-white p-6 rounded shadow max-w-xl mx-auto">
        <img :src="product.image" :alt="product.title" class="w-full h-64 object-contain mb-4" />
        <h3 class="text-xl font-bold mb-2">{{ product.title }}</h3>
        <p class="text-gray-600 mb-2">{{ product.description }}</p>
        <p class="text-blue-600 font-bold text-lg">{{ product.price }} $</p>
        <p class="text-sm text-gray-500">Catégorie : {{ product.category }}</p>
      </div>
    </div>

    <pre class="text-xs mt-4">{{ product }}</pre>
  </section>
</template>

<script setup>
const route = useRoute()
const id = route.params.id

const { data: product, pending, error } = await useFetch(`/api/products/${id}`)
</script>


