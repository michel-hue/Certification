<template>
    <div v-if="user">
        <p>{{ user.id }}</p>
        <p>{{ user.email }}</p>
    </div>
</template>
<script setup>
const user= ref()
const route= useRoute()
const id = route.params.id

user.value= await $fetch (`/api/users/${id}`)
</script>

<!-- <template>
    <div v-if="error"><p>Erreur : {{ error.message }}</p></div>
    <div v-else-if="pending">
        <p>Chargement.........</p>
    </div>
    <div v-else>
        <div v-if="user">
        <p>{{ user.id }}</p>
        <p>{{ user.email }}</p>
    </div>
    </div>
</template>

<script setup>
const route = useRoute()
const id= route.params.id

const { data: users, pending, error } = await useFetch(`/api/users/${id}`)
</script> -->