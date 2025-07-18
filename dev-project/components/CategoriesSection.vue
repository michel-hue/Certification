<template>
  <section>
    <!-- On boucle sur chaque catégorie de produits -->
    <div
      v-for="(products, category) in productsByCategory"
      :key="category"
      class="mb-12 max-w-6xl mx-auto px-4"
    >
      <!-- Titre de la catégorie, avec une majuscule automatique -->
      <h2 class="text-2xl font-bold mb-4 capitalize text-gray-800 dark:text-gray-100">{{ category }}</h2>

      <!-- Grille des produits -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <!-- Pour chaque produit dans la catégorie -->
        <div
          v-for="product in products"
          :key="product.id"
          class="relative bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden cursor-pointer group"
        >
          <!-- Image du produit -->
          <img
            :src="product.image"
            :alt="product.title"
            class="w-full h-48 object-contain p-4"
          />

          <!-- Overlay qui apparait quand on survole la carte -->
          <div
            class="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
          >
            <!-- Bouton pour ajouter au panier (évite que le clic remonte avec .stop) -->
            <button
              @click.stop="addToCart(product)"
              class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              Ajouter au panier
            </button>
          </div>

          <!-- Infos du produit (titre + prix) -->
          <div class="p-4">
            <h3 class="text-md font-semibold mb-1 truncate text-gray-900 dark:text-gray-200">{{ product.title }}</h3>
            <p class="text-green-600 dark:text-green-400 font-bold">${{ product.price.toFixed(2) }}</p>
          </div>
        </div>
      </div>

      <!-- Lien pour voir tous les produits de la catégorie -->
      <div class="mt-4 text-right">
        <NuxtLink
          :to="`/users/products/categories/${category}`"
          class="text-green-600 dark:text-green-400 hover:underline font-semibold"
        >
          Voir tous les produits
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup>
// Import pas nécessaire vu qu'on utilise juste ref et onMounted

// Liste des catégories qu'on veut afficher
const categories = [
  'electronics',
  'jewelery',
  "men's clothing",
  "women's clothing",
]

// Objet réactif qui contiendra les produits groupés par catégorie
const productsByCategory = ref({})

// Fonction pour récupérer les produits depuis l'API FakeStore
async function fetchProducts() {
  const res = await fetch('https://fakestoreapi.com/products')
  const allProducts = await res.json()

  // On crée un objet vide, puis on remplit avec les produits de chaque catégorie
  const grouped = {}
  for (const category of categories) {
    // On filtre les produits par catégorie et on prend les 3 derniers
    grouped[category] = allProducts
      .filter(p => p.category === category)
      .slice(-3)
  }
  // On met à jour la variable réactive
  productsByCategory.value = grouped
}

// Fonction appelée quand on clique sur "Ajouter au panier"
function addToCart(product) {
  alert(`Ajouté au panier: ${product.title}`)
  // Ici tu peux mettre ta vraie logique panier plus tard
}

// On lance la récupération des produits quand le composant est monté
onMounted(fetchProducts)
</script>
