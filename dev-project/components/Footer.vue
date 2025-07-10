<template>
  <footer class="bg-gray-900 text-white py-6 mt-12">
     <nav>
  <ul class="flex justify-center gap-6 text-white font-medium">
    <li>
      <a href="/users" class="flex items-center gap-2 hover:text-gray-600">
        <i class="fa-solid fa-user text-blue-400"></i>
        Se connecter
      </a>
    </li>

    <li>
      <a href="/carts" class="flex items-center gap-2 hover:text-gray-600">
        <i class="fa-solid fa-bag-shopping text-blue-400"></i>
        <span>Panier</span>
      </a>
    </li>

    <li>
      <a href="/products/categories" class="flex items-center gap-2 hover:text-gray-600">
        <i class="fa-solid fa-layer-group text-blue-500"></i>
        Catégories
      </a>
    </li>

    <li>
      <a href="#" class="flex items-center gap-2 hover:text-gray-600">
        <i class="fa-solid fa-envelope text-blue-500"></i>
        Contact
      </a>
    </li>
  </ul>
</nav>

    <p class="text-center text-sm text-gray-500 mt-4">© {{ year }} Ma Boutique. Tous droits réservés.</p>
  </footer>
</template>

<script setup>
const year = new Date().getFullYear()
</script>
