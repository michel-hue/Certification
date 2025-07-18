<template>
  <header
    class="sticky top-0 z-50 border-b-4 border-green-300 bg-white dark:bg-gray-900 shadow p-4 dark:border-green-700"
  >
    <!-- Conteneur principal : logo + navigation -->
    <div class="flex flex-wrap items-center justify-between gap-4">
      
      <!-- Logo de la boutique -->
      <h1 class="flex items-center gap-2 text-2xl font-bold text-gray-400 dark:text-gray-200">
        Ma Boutique
        <img src="/images/logo.png" alt="Logo" class="w-9 h-9 object-contain rounded-full" />
      </h1>

      <!-- Bouton menu hamburger-->
      <button
        class="md:hidden text-2xl text-gray-600 dark:text-gray-300 focus:outline-none"
        @click="mobileMenuOpen = !mobileMenuOpen"
      >
        <i :class="mobileMenuOpen ? 'fas fa-times' : 'fas fa-bars'"></i>
      </button>

      <!-- Navigation principale -->
      <nav :class="['w-full md:w-auto', mobileMenuOpen ? 'block' : 'hidden md:block']">
        <ul
          class="flex flex-col md:flex-row gap-4 md:gap-6 mt-4 md:mt-0 text-gray-400 dark:text-gray-200 font-medium items-start md:items-center"
        >
          <!-- Accueil -->
          <li>
            <NuxtLink to="/users" class="text-green-600 dark:text-green-400 transition">Home</NuxtLink>
          </li>

          <!-- Produits -->
          <li>
            <NuxtLink to="/users/products" class="hover:text-green-500 transition">Products</NuxtLink>
          </li>

          <!-- Services -->
          <li>
            <NuxtLink to="/users/services" class="hover:text-green-500 transition">Services</NuxtLink>
          </li>

          <!--  panier -->
          <li>
            <NuxtLink to="/users/carts" class="hover:text-green-500 transition" aria-label="Panier">
              <i class="fa-solid fa-cart-shopping text-xl"></i>
            </NuxtLink>
          </li>

          <!-- Recherche -->
          <li class="relative">
            <button @click="toggleSearch" aria-label="Recherche">
              <i class="fa-solid fa-magnifying-glass text-xl hover:text-green-500 transition"></i>
            </button>

            <!-- Champ de recherche affiché dynamiquement -->
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
          </li>

          <!-- Profil -->
          <li>
            <NuxtLink :to="`/users/users/dashboard`" class="hover:text-green-500 transition" aria-label="Profil">
              <i class="fa-solid fa-user text-xl"></i>
            </NuxtLink>
          </li>

          <!-- Bouton dark mode -->
          <li>
            <button
              @click="toggleDarkMode"
              class="text-xl hover:text-green-500 transition"
              aria-label="Mode sombre / clair"
            >
              <i :class="isDark ? 'fas fa-sun' : 'fas fa-moon'"></i>
            </button>
          </li>

          <!-- Déconnexion -->
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// Router pour redirection
const router = useRouter()

// État du menu mobile (ouvert/fermé)
const mobileMenuOpen = ref(false)

// État du champ de recherche visible ou non
const showSearch = ref(false)
function toggleSearch() {
  showSearch.value = !showSearch.value
}

// Texte saisi dans la recherche
const searchQuery = ref('')

// Liste complète des produits pour recherche
const allProducts = ref([])
const filteredProducts = ref([])

// Fonction qui filtre les produits selon la recherche
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

// Chargement des produits via API interne
const { data } = await useFetch('/api/products')
allProducts.value = data.value
filteredProducts.value = data.value

// Fonction pour déconnecter l'utilisateur
function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('userId')
  router.push('/users/auth/login')
}

// Gestion du mode sombre
const isDark = ref(false)
onMounted(() => {
  // Au chargement, on vérifie si thème sombre était actif
  const theme = localStorage.getItem('theme')
  if (theme === 'dark') {
    document.documentElement.classList.add('dark')
    isDark.value = true
  }
})

// Basculer entre mode clair et sombre, en sauvegardant en localStorage
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
/* Animation d'apparition/disparition du champ recherche */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
