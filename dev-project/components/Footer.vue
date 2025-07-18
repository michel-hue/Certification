<template>
  <!-- Footer avec fond clair ou sombre selon le mode -->
  <footer class="bg-white dark:bg-gray-900 text-gray-400 dark:text-gray-400 py-6 mt-12">

    <!-- Navigation du footer -->
    <nav>
      <ul class="flex justify-center flex-wrap gap-6 font-medium text-sm">

        <!-- Lien vers la page d'accueil -->
        <li>
          <NuxtLink to="/#" class="flex items-center gap-2 text-green-600 transition dark:text-green-400">
            Home
          </NuxtLink>
        </li>

        <!-- Lien vers la page produits -->
        <li>
          <NuxtLink to="/users/products" class="flex items-center gap-2 hover:text-green-600 dark:hover:text-green-400 transition">
            Products
          </NuxtLink>
        </li>

        <!-- Lien vers la page services avec une icône enveloppe -->
        <li>
          <NuxtLink to="/users/services" class="flex items-center gap-2 hover:text-green-600 dark:hover:text-green-400 transition">
            <i class="fa-solid fa-envelope text-gray-400 dark:text-gray-400"></i>
            Services
          </NuxtLink>
        </li>

        <!-- Lien vers la page de connexion avec icône utilisateur -->
        <li>
          <NuxtLink to="/users/auth/login" class="flex items-center gap-2 hover:text-green-600 dark:hover:text-green-400 transition">
            <i class="fa-solid fa-user text-gray-400 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400"></i>
          </NuxtLink>
        </li>

        <!-- Lien vers la page panier avec icône panier -->
        <li>
          <NuxtLink to="/users/carts" class="flex items-center gap-2 hover:text-green-600 dark:hover:text-green-400 transition">
            <i class="fa-solid fa-cart-shopping text-gray-400 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400"></i>
          </NuxtLink>
        </li>

      </ul>
    </nav>

    <!-- Texte copyright centré -->
    <p class="text-center text-sm text-gray-700 dark:text-gray-300 mt-4">
      © {{ year }} Ma Boutique. Tous droits réservés.
    </p>
  </footer>
</template>

<script setup>
// Variable qui récupère l'année en cours automatiquement
const year = new Date().getFullYear()
</script>
