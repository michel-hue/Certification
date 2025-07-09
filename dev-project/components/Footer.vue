<template>
  <footer class="bg-gray-900 text-white py-6 mt-12">
    <nav>
      <ul class="flex justify-center gap-8 font-medium">
        <li><a href="#" class="hover:text-blue-900">Se connecter</a></li>
        <li><a href="/carts" class="hover:text-blue-900">Panier</a></li>
        <li><a href="#" class="hover:text-blue-900">Contact</a></li>
         <li><a href="/products/categories" class="hover:text-blue-900">Categories</a></li>
      </ul>
    </nav>
    <p class="text-center text-sm text-gray-500 mt-4">© {{ year }} Ma Boutique. Tous droits réservés.</p>
  </footer>
</template>

<script setup>
const year = new Date().getFullYear()
</script>
