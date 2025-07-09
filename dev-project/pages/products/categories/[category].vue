<template> <br>
<NuxtLink :to="`/products/categories`">  <button class="inline-block text-xs text-white mb-2 border rounded-xl p-4 bg-gray-900">    < Retour </button> 
     </NuxtLink>
  <section class="p-6 bg-gray-50 min-h-screen">
    <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">
      Catégorie : <span class="capitalize">{{ category }}</span>
    </h2>

    <div v-if="!categorie" class="text-center text-gray-500">
      Chargement des produits…
    </div>

    <div v-else>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <NuxtLink
          v-for="product in categorie.products"
          :key="product.id"
          :to="`/products/${product.id}`"
          class="block bg-white rounded-xl p-4 shadow hover:shadow-lg hover:scale-105 transition-all text-center"
        >
          <img
            :src="product.image"
            :alt="product.title"
            class="h-40 w-full object-contain mb-4"
          />
          <p class="font-semibold text-gray-800 mb-1 line-clamp-2">
            {{ product.title }}
          </p>
          <p class="text-blue-600 font-bold mb-2">{{ product.price }} $</p>
          <span class="inline-block bg-gray-200 text-xs text-gray-600 px-3 py-1 rounded-full">
            {{ product.category }}
          </span>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const category = route.params.category as string
const categorie = ref<any>(null)

categorie.value = await $fetch(`/api/products/${category}`)
</script>

