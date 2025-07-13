<template>
  <div>
    <h1>Catégorie : {{ category }}</h1>
    <!-- Ton affichage de produits par catégorie -->
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'

const route = useRoute()
const category = route.params.category

const products = ref([])
const error = ref(null)
const loading = ref(true)

onMounted(async () => {
  try {
    products.value = await $fetch(`https://fakestoreapi.com/products/category/${category}`)
  } catch (e) {
    error.value = e
  } finally {
    loading.value = false
  }
})
</script>
