<template>
  <div class="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 flex flex-col transition-all">
    <!-- Header -->
    <header
      class="md:py-6 px-6 bg-white dark:bg-gray-800 shadow-md relative transition-all border-b-4"
      :class="isDark ? 'border-green-600' : 'border-transparent'"
    >
      <div class="grid grid-cols-3 items-center">
        <!-- Bouton retour -->
        <NuxtLink to="/products" class="flex justify-start">
          <button
            class="bg-gray-100 dark:bg-gray-700 hover:bg-green-600 text-gray-800 dark:text-white px-4 py-2 rounded-xl transition flex items-center gap-2"
            aria-label="Voir les produits"
          >
            <i class="fas fa-store"></i> Voir les produits
          </button>
        </NuxtLink>

        <!-- Logo -->
        <div class="flex justify-center items-center gap-3 text-3xl font-bold">
          <h1 class="text-green-600 dark:text-green-500">Ma Boutique</h1>
          <img
            src="/images/logo.png"
            alt="Logo"
            class="w-9 h-9 object-contain rounded-full border border-green-500"
          />
        </div>

        <!-- Dark mode -->
        <div class="flex justify-end">
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

    <!-- Contenu principal -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Lien admin -->
    <NuxtLink to="/admin" class="fixed bottom-4 right-4 group z-50" aria-label="Accès admin">
      <div class="p-3 rounded-full bg-gray-200 dark:bg-gray-700 group-hover:bg-green-600 transition relative cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-900 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
const isDark = ref(false)

onMounted(() => {
  isDark.value = localStorage.getItem('theme') === 'dark'
  updateHtmlClass()
})

function toggleDarkMode() {
  isDark.value = !isDark.value
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  updateHtmlClass()
}

function updateHtmlClass() {
  document.documentElement.classList.toggle('dark', isDark.value)
}
</script>
