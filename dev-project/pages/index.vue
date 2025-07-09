<template>
<!-- <Products v-for="product in products" key:="product" /> -->
 <p>{{ product.title }}</p>
</template>
<script setup>
const product= ref([])
product.value= await $fetch ("https://fakestoreapi.com/products")
</script>