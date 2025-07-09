<template>
    <div v-if="cart">
    <p>{{ cart.id }}</p>
    <p>{{ cart.userID }}</p>
    <p>{{ cart.date }}</p>
    </div>
</template>
<script setup>
const route= useRoute()
const id= route.params.id
const cart= ref()
cart.value = await $fetch (`/api/carts/${id}`)
</script>