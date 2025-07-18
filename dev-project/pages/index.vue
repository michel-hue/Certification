<template>
  <!-- Conteneur principal avec changement de couleur selon le mode sombre -->
  <div :class="isDark ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'" class="min-h-screen flex flex-col transition-colors duration-300">
    
  
    <!-- Header -->
<header
  :class="[
    'py-4 px-6 shadow-md transition-colors duration-300',
    isDark ? 'bg-gray-800 border-b-4 border-green-600' : 'bg-white'
  ]"
>
  <!-- Flex responsive -->
  <div class="flex flex-col md:flex-row justify-between items-center gap-4">
    
    <!-- Bouton retour -->
    <NuxtLink to="/products" class="w-full md:w-auto flex justify-start md:justify-start">
      <button
        :class="[
          'px-4 py-2 rounded-xl transition flex items-center gap-2 w-full md:w-auto',
          isDark ? 'bg-gray-700 text-white hover:bg-green-600' : 'bg-gray-100 text-gray-800 hover:bg-green-600 hover:text-white'
        ]"
      >
        <i class="fas fa-store"></i> Voir les produits
      </button>
    </NuxtLink>

    <!-- Logo centré -->
    <div class="flex justify-center items-center gap-3 text-2xl font-bold">
      <h1 class="text-green-500">Ma Boutique</h1>
      <img src="/images/logo.png" alt="Logo" class="w-9 h-9 object-contain rounded-full" />
    </div>

    <!-- Bouton mode sombre -->
    <div class="flex justify-end w-full md:w-auto">
      <button
        @click="toggleDarkMode"
        class="text-xl hover:text-green-500 transition"
        aria-label="Mode sombre / clair"
      >
        <i :class="isDark ? 'fas fa-sun' : 'fas fa-moon'"></i>
      </button>
    </div>
    
  </div>
</header>


    <!-- Contenu principal de la page -->
    <main :class="['flex flex-col-reverse md:flex-row flex-1 overflow-hidden', isDark ? 'bg-gray-900' : 'bg-gray-100']">
      
      <!-- Colonne de gauche : formulaire d'inscription -->
      <div class="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-10">
        <div class="w-full max-w-lg space-y-6">
          <h2 class="text-3xl font-bold">Créer un compte</h2>
          <p class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
            Remplissez les informations ci-dessous pour créer votre compte.
          </p>
          <!-- Composant du formulaire -->
          <RegisterForm />
        </div>
      </div>

      <!-- Colonne de droite : illustration visuelle -->
      <div class="w-full md:w-1/2 flex justify-center items-center p-4">
        <img
          src="/images/online-shopping.png"
          alt="Illustration d'achat en ligne"
          class="w-full max-w-md md:max-w-2xl h-auto object-contain"
          loading="lazy"
        />
      </div>
    </main>

    <!-- Lien d'accès vers l'espace admin (bouton flottant en bas à droite) -->
    <NuxtLink to="/admin" class="fixed bottom-4 right-4 group z-50" aria-label="Accès admin">
      <div class="p-3 rounded-full bg-gray-700 group-hover:bg-green-600 transition relative cursor-pointer">
        <!-- Icône SVG personnalisée -->
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 6v.01M12 18v.01M6 12h.01M18 12h.01M8.465 8.465l.01.01M15.535 15.535l.01.01M8.465 15.535l.01-.01M15.535 8.465l.01-.01" />
        </svg>
        <!-- Info bulle qui s'affiche au survol -->
        <span class="absolute right-12 top-1/2 transform -translate-y-1/2 bg-green-600 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
          Admin
        </span>
      </div>
    </NuxtLink>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import RegisterForm from '~/components/RegisterForm.vue'

// Variable pour suivre l'état du mode sombre
const isDark = ref(false)

// Lorsque le composant est monté, on récupère le thème stocké dans le localStorage
onMounted(() => {
  const theme = localStorage.getItem('theme')
  if (theme === 'dark') {
    isDark.value = true
    document.documentElement.classList.add('dark')
  }
})

// Fonction de basculement entre mode sombre et clair
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
