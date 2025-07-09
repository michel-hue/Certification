<template>
  <div v-if="categorie">
    <h1>Catégorie : {{ categorie.name }}</h1>
    <div v-for="product in categorie.products" :key="product.id">
      <p>{{ product.title }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const category = route.params.category

const categorie = ref(null)

categorie.value = await $fetch(`/api/products/${category}`)
</script>

