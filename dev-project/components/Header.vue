<template>
  <header class="sticky top-0 z-50 bg-white shadow p-4">
    <div class="flex flex-col md:flex-row items-center justify-between gap-4">

      <!-- Nom de la boutique -->
      <h1 class="flex items-center gap-2 text-2xl font-bold text-gray-400">
        Ma Boutique
          <img src="/images/logo.png" alt="Logo" class="w-9 h-9 object-contain rounded-full" />
      </h1>

      <!-- Navigation -->
      <nav>
        <ul class="flex gap-6 text-gray-400 font-medium items-center">

          <!-- HOME -->
          <li>
            <NuxtLink to="/#" class="text-green-600 transition">Home</NuxtLink>
          </li>

          <!-- PRODUCTS -->
          <li>
            <NuxtLink to="/products" class="hover:text-green-500 transition">Products</NuxtLink>
          </li>

          <!-- SERVICES -->
          <li>
            <NuxtLink to="/services" class="hover:text-green-500 transition">Services</NuxtLink>
          </li>

          <!-- PANIER (icone seule) -->
          <li>
            <NuxtLink to="/users/carts" class="hover:text-green-500 transition" aria-label="Panier">
              <i class="fa-solid fa-cart-shopping text-xl"></i>
            </NuxtLink>
          </li>
          <!-- RECHERCHE (icone + champ caché) -->
<li class="relative">
  <button @click="toggleSearch" aria-label="Recherche">
    <i class="fa-solid fa-magnifying-glass text-xl text-gray-400 hover:text-green-500 transition"></i>
  </button>

  <transition name="fade">
    <form
      v-if="showSearch"
      @submit.prevent="rechercherProduit"
      class="absolute top-10 right-0 bg-white shadow-md p-2 rounded-md flex gap-2 z-50"
    >
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Rechercher..."
        class="w-48 px-2 py-1 border rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button type="submit" class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-green-500">
        OK
      </button>
    </form>
  </transition>
</li>


          <!-- PROFIL (icone seule) -->
          <li>
            <NuxtLink to="/users/users/dashboard" class="hover:text-green-500 transition" aria-label="Profil">
              <i class="fa-solid fa-user text-xl"></i>
            </NuxtLink>
          </li>

          <!-- DECONNEXION -->
          <li>
            <button
              @click="logout"
              class="text-red-600 hover:text-red-800 transition bg-transparent border-none cursor-pointer"
              aria-label="Déconnexion"
            >
              <i class="fa-solid fa-right-from-bracket text-xl"></i>
            </button>
          </li>

        </ul>
      </nav>
    </div>
  </header>
</template>



<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const searchQuery = ref('')
const allProducts = ref([])      // Tous les produits récupérés depuis l'API
const filteredProducts = ref([]) // Produits affichés après recherche

// Charger les produits au démarrage
const { data, error } = await useFetch('/api/products')
allProducts.value = data.value
filteredProducts.value = data.value

// Pour afficher/cacher la barre de recherche
const showSearch = ref(false)

function toggleSearch() {
  showSearch.value = !showSearch.value
}

// Fonction de recherche
function rechercherProduit() {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) {
    filteredProducts.value = allProducts.value // si rien tapé, tout montrer
  } else {
    filteredProducts.value = allProducts.value.filter(product =>
      product.title.toLowerCase().includes(q)
    )
  }
}



const router = useRouter()

function logout() {
  // Supprime le token et userId (ou autres données liées à la session)
  localStorage.removeItem('token')
  localStorage.removeItem('userId')

  // Redirection vers la page de connexion
  router.push('/users/auth/login')
}

</script>












