<template>
    <!-- <NuxtLink :to="`/products/${product.id}`"> -->
  <div v-if="error">
    <p>Erreur : {{ error.message }}</p>
  </div>
  <div v-else-if="pending">
    <p>Chargement…</p>
  </div>
  <div v-else>
    <div v-for="product in products" :key="product.id">
        <span>{{ product.category }}</span>
      <img :src="product.image" :alt="product.title" class="h-40 object-contain mb-2" />

      <p>{{ product.title }}</p>
      <p>{{ product.price }}$</p>
    </div>
  </div>
<!-- </NuxtLink> -->
</template>

<script setup>
const { data: products, error, pending } = await useAsyncData('products', () =>
  $fetch('/api/products')
)
</script>
