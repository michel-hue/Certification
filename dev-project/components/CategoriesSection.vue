<template>
  <section>
    <div
      v-for="(products, category) in productsByCategory"
      :key="category"
      class="mb-12 max-w-6xl mx-auto px-4"
    >
      <h2 class="text-2xl font-bold mb-4 capitalize">{{ category }}</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div
          v-for="product in products"
          :key="product.id"
          class="relative bg-white rounded-lg shadow overflow-hidden cursor-pointer group"
        >
          <img
            :src="product.image"
            :alt="product.title"
            class="w-full h-48 object-contain p-4"
          />
          <!-- Overlay au survol -->
          <div
            class="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
          >
            <button
              @click.stop="addToCart(product)"
              class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Ajouter au panier
            </button>
          </div>
          <div class="p-4">
            <h3 class="text-md font-semibold mb-1 truncate">{{ product.title }}</h3>
            <p class="text-green-600 font-bold">${{ product.price.toFixed(2) }}</p>
          </div>
        </div>
      </div>
      <div class="mt-4 text-right">
        <NuxtLink
          :to="`/users/products/categories/${category}`"
          class="text-blue-600 hover:underline font-semibold"
        >
          Voir tous les produits
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const categories = [
  'electronics',
  'jewelery',
  "men's clothing",
  "women's clothing",
]

const productsByCategory = ref({})

async function fetchProducts() {
  const res = await fetch('https://fakestoreapi.com/products')
  const allProducts = await res.json()

  const grouped = {}
  for (const category of categories) {
    grouped[category] = allProducts
      .filter(p => p.category === category)
      .slice(-3)
  }
  productsByCategory.value = grouped
}

function addToCart(product) {
  alert(`Ajouté au panier: ${product.title}`)
  // À remplacer par ta logique panier réelle
}

onMounted(fetchProducts)
</script>
