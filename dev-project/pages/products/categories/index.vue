<template>
    <div v-if="error">Erreur :<p>{{ error.message}}</p></div>
    <div v-else-if="pending">
        <p>Chargement............</p>
    </div>
    <div v-if="categories">
        <div v-for="categorie in categories" :key="categorie.id">
            <p>{{ categories }}</p>
        </div>
    </div>
</template>
<script setup>
const { data: categories, error, pending } = await useAsyncData('categories', () =>
  useFetch('/api/products/categories').then(r => r.data.value)
)

</script>