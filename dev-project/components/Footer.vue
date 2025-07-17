<template>
  <footer class="bg-white text-gray-400 py-6 mt-12">
    <!-- Navigation -->
    <nav>
      <ul class="flex justify-center flex-wrap gap-6 font-medium text-sm">

        <li>
          <NuxtLink to="/#" class="flex items-center gap-2 text-green-600 transition">
            Home
          </NuxtLink>
        </li>

        <li>
          <NuxtLink to="/#" class="flex items-center gap-2 hover:text-green-600 transition">
            Products
          </NuxtLink>
        </li>

        <li>
          <NuxtLink to="/#" class="flex items-center gap-2 hover:text-green-600 transition">
            <i class="fa-solid fa-envelope text-white"></i>
            Services
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/users/auth/login" class="flex items-center gap-2 hover:text-green-600 transition">
            <i class="fa-solid fa-user text-gray-400 hover:text-green-600"></i>
            
          </NuxtLink>
        </li>

        <li>
          <NuxtLink to="/users/carts" class="flex items-center gap-2 hover:text-green-600 transition">
            <i class="fa-solid fa-cart-shopping text-gray-400 hover:text-green-600 "></i>
          </NuxtLink>
        </li>

      </ul>
    </nav>

    <!-- Copyright -->
    <p class="text-center text-sm text-gray-700 mt-4">
      © {{ year }} Ma Boutique. Tous droits réservés.
    </p>
  </footer>
</template>

<script setup>
const year = new Date().getFullYear()
</script>
