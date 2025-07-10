<template>
    <div v-if="product">
        <p>{{ product.id }}</p>
        <p>{{ product.title }}</p>
    </div>
</template>
<script setup>
const product= ref()
const route= useRoute()
const id = route.params.id

product.value= await $fetch (`/api/products/${id}`)
</script>


