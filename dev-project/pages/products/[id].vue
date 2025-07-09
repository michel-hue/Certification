<template>
  <div class="p-6">
    <div v-if="error">
      <p class="text-red-500">Erreur : {{ error.message }}</p>
    </div>

    <div v-else-if="pending">
      <p>Chargement...</p>
    </div>

    <div v-else-if="product">
      <img :src="product.image" :alt="product.title" class="h-40 object-contain mb-4" />
      <h2 class="text-xl font-bold">{{ product.title }}</h2>
      <p class="text-gray-600">{{ product.price }} $</p>
      <p class="text-sm text-gray-500 mt-2">{{ product.description }}</p>
    </div>

    <div v-else>
      <p>Aucun produit trouvé.</p>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const id = route.params.id

const { data: product, error, pending } = await useAsyncData(`product-${id}`, () =>
  $fetch(`/api/products/${id}`)
)
</script>
