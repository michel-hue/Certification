<template>
  <!-- Conteneur principal avec image de fond -->
  <div
    :class="isDark ? 'text-gray-100' : 'text-gray-900'"
    class="min-h-screen flex flex-col transition-colors duration-100 bg-cover bg-center"
    style="
      background-image: url('/images/fond3.jpg');
    "
  >
    <!-- HEADER -->
    <header
      :class="[
        'py-4 px-6 shadow-md transition-colors duration-300 flex flex-col md:flex-row items-center md:justify-between gap-4 border-b-4 border-green-400',
        isDark ? 'bg-gray-800/80 border-b-4 border-green-600' : 'bg-white/80'
      ]"
    >
      <!-- Bouton gauche : Voir les produits -->
      <NuxtLink to="/products">
        <button
          :class="[
            'px-4 py-2 rounded-xl transition flex items-center gap-2',
            isDark ? 'bg-gray-700 text-white hover:bg-green-600' : 'bg-gray-100 text-gray-800 hover:bg-green-600 hover:text-white'
          ]"
        >
          <i class="fas fa-store"></i> Voir les produits
        </button>
      </NuxtLink>

      <!-- Logo + nom au centre -->
      <div class="flex items-center gap-3 text-2xl font-bold order-first md:order-none">
        <h1 class="text-green-500">Ma Boutique</h1>
        <img src="/images/logo.png" alt="Logo" class="w-9 h-9 object-contain rounded-full" />
      </div>

      <!-- Bouton mode sombre -->
      <div>
        <button
          @click="toggleDarkMode"
          class="text-xl hover:text-green-500 transition"
          aria-label="Mode sombre / clair"
        >
          <i :class="isDark ? 'fas fa-sun' : 'fas fa-moon'"></i>
        </button>
      </div>
    </header>

    <!-- CONTENU PRINCIPAL -->
    <main
      :class="[
        'flex-1 flex flex-col md:flex-row',
        isDark ? 'bg-gray-900/80' : 'bg-white/80'
      ]"
    >
      <!-- Partie gauche vide (ou image/infos si besoin) -->
      <div class="hidden md:block w-1/2"></div>

      <!-- Partie droite : formulaire positionné en haut à droite -->
      <div class="w-full md:w-1/2 flex justify-end items-start p-6">
        <div class="w-full max-w-lg space-y-6 text-right">
          <h2 class="text-3xl font-bold">Créer un compte</h2>
          <p :class="isDark ? 'text-gray-400' : 'text-gray-600'" class="text-sm">
            Remplissez les informations ci-dessous pour créer votre compte.
          </p>
          <RegisterForm />
        </div>
      </div>
    </main>

    <!-- BOUTON ADMIN FLOTTANT -->
    <NuxtLink to="/admin" class="fixed bottom-4 right-4 group z-50" aria-label="Accès admin">
      <div class="p-3 rounded-full bg-gray-700 group-hover:bg-green-600 transition relative cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 6v.01M12 18v.01M6 12h.01M18 12h.01M8.465 8.465l.01.01M15.535 15.535l.01.01M8.465 15.535l.01-.01M15.535 8.465l.01-.01" />
        </svg>
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

const isDark = ref(false)

onMounted(() => {
  const theme = localStorage.getItem('theme')
  if (theme === 'dark') {
    isDark.value = true
    document.documentElement.classList.add('dark')
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
