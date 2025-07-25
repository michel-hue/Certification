<template>
  <header
    class="sticky top-0 z-50 border-b-4 border-green-300 bg-white dark:bg-gray-900 shadow p-4 dark:border-green-700"
  >
    <div class="flex flex-wrap items-center justify-between gap-4">
      <h1 class="flex items-center gap-2 text-2xl font-bold text-gray-400 dark:text-green-600">
        Ma Boutique
        <img src="/images/logo.png" alt="Logo" class="w-9 h-9 object-contain rounded-full" />
      </h1>

      <button
        class="md:hidden text-2xl text-gray-600 dark:text-gray-300 focus:outline-none"
        @click="mobileMenuOpen = !mobileMenuOpen"
      >
        <i :class="mobileMenuOpen ? 'fas fa-times' : 'fas fa-bars'"></i>
      </button>

      <nav :class="['w-full md:w-auto', mobileMenuOpen ? 'block' : 'hidden md:block']">
        <ul
          class="flex flex-col md:flex-row gap-4 md:gap-6 mt-4 md:mt-0 text-gray-400 dark:text-gray-200 font-medium items-start md:items-center"
        >
          <li>
            <NuxtLink to="/users" class="text-green-600 dark:text-green-400 transition">Home</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/users/products" class="hover:text-green-500 transition">Products</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/users/services" class="hover:text-green-500 transition">Services</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/users/carts" class="hover:text-green-500 transition" aria-label="Panier">
              <i class="fa-solid fa-cart-shopping text-xl"></i>
            </NuxtLink>
          </li>

          <li class="relative">
            <button @click="toggleSearch" aria-label="Recherche">
              <i class="fa-solid fa-magnifying-glass text-xl hover:text-green-500 transition"></i>
            </button>

            <transition name="fade">
              <form
                v-if="showSearch"
                @submit.prevent="rechercherProduit"
                class="absolute top-10 right-0 bg-white dark:bg-gray-800 shadow-md p-2 rounded-md flex gap-2 z-50"
              >
                <input
                  type="text"
                  v-model="searchQuery"
                  placeholder="Rechercher..."
                  class="w-48 px-2 py-1 border rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button type="submit" class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-green-500">OK</button>
              </form>
            </transition>

            <!-- Liste des résultats de recherche -->
            <transition name="fade">
              <ul
                v-if="showSearch && filteredProducts.length && searchQuery.trim() !== ''"
                class="absolute top-16 right-0 max-h-64 overflow-auto bg-white dark:bg-gray-800 shadow-md rounded-md w-48 z-50"
              >
                <li
                  v-for="product in filteredProducts"
                  :key="product.id"
                  class="px-3 py-2 hover:bg-green-100 dark:hover:bg-green-700 cursor-pointer"
                  @click="goToProduct(product.id)"
                >
                  {{ product.title }}
                </li>
              </ul>
            </transition>
          </li>

          <li>
            <NuxtLink :to="`/users/users/dashboard`" class="hover:text-green-500 transition" aria-label="Profil">
              <i class="fa-solid fa-user text-xl"></i>
            </NuxtLink>
          </li>

          <li>
            <button
              @click="toggleDarkMode"
              class="text-xl hover:text-green-500 transition"
              aria-label="Mode sombre / clair"
            >
              <i :class="isDark ? 'fas fa-sun' : 'fas fa-moon'"></i>
            </button>
          </li>

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
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const mobileMenuOpen = ref(false)
const showSearch = ref(false)
function toggleSearch() {
  showSearch.value = !showSearch.value
}

const searchQuery = ref('')
const allProducts = ref([])
const filteredProducts = ref([])

// Charger les produits
const { data } = await useFetch('/api/products')
allProducts.value = data.value || []
filteredProducts.value = data.value || []

// Filtrer automatiquement lors de la saisie
watch(searchQuery, (newVal) => {
  const q = newVal.trim().toLowerCase()
  if (!q) {
    filteredProducts.value = allProducts.value
  } else {
    filteredProducts.value = allProducts.value.filter(product =>
      product.title.toLowerCase().includes(q)
    )
  }
})

// Soumission du formulaire (utile si tu veux garder bouton OK)
function rechercherProduit() {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) {
    filteredProducts.value = allProducts.value
  } else {
    filteredProducts.value = allProducts.value.filter(product =>
      product.title.toLowerCase().includes(q)
    )
  }
}

// Aller vers la page produit au clic
function goToProduct(id) {
  showSearch.value = false
  searchQuery.value = ''
  router.push(`/users/products/${id}`)
}

// Déconnexion
function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('userId')
  router.push('/users/auth/login')
}

// Mode sombre
const isDark = ref(false)
onMounted(() => {
  const theme = localStorage.getItem('theme')
  if (theme === 'dark') {
    document.documentElement.classList.add('dark')
    isDark.value = true
  }
})

function toggleDarkMode() {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
