<template>
    <div v-if="error">Erreur :{{ error.message }}</div>
    <div v-else-if="pending">
        <p>Chargement............</p>
    </div>
    <div v-else>
        <div v-for="cart in carts" :key="cart.id">
            <p>{{ cart.id }}</p>
            <p>{{ cart.userID }}</p>
            <p>{{ cart.date }}</p>
            <p>{{ cart.product }}</p>
        </div>
    </div>
</template>
<script setup>
const { data: carts, error, pending } = await useAsyncData('carts', () =>
  $fetch('/api/carts')
)
</script>