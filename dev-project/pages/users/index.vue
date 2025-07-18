<template>
  <div>
    <Header />

    <main class="bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-100">
      <!-- Hero Section -->
      <section
        class="relative bg-cover bg-center h-96 flex flex-col items-center justify-center text-white font-extrabold text-4xl md:text-6xl px-6 text-center"
        style="background-image: url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1470&q=80')"
      >
        <div class="bg-black bg-opacity-50 p-6 rounded-lg max-w-3xl">
          Découvrez les meilleurs produits tech en promo !
          <button
            @click="$router.push('/users/products/categories/electronics')"
            class="mt-6 bg-green-600 px-6 py-3 rounded-lg text-lg hover:bg-green-700 transition dark:bg-green-900"
          >
            Shoppez maintenant
          </button>
        </div>
      </section>

      <!-- Services / Garanties -->
      <section class="my-16 max-w-7xl mx-auto px-6">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-lg transition">
            <i class="fas fa-shipping-fast text-green-600 text-3xl mb-3"></i>
            <h3 class="text-lg font-semibold dark:text-white">Livraison rapide</h3>
            <p class="text-gray-600 dark:text-gray-300 text-sm">
              Recevez vos produits en 48h partout en Côte d’Ivoire.
            </p>
          </div>

          <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-lg transition">
            <i class="fas fa-shield-alt text-green-600 text-3xl mb-3"></i>
            <h3 class="text-lg font-semibold dark:text-white">Paiement sécurisé</h3>
            <p class="text-gray-600 dark:text-gray-300 text-sm">
              Transactions cryptées pour une sécurité maximale.
            </p>
          </div>

          <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-lg transition">
            <i class="fas fa-star text-green-600 text-3xl mb-3"></i>
            <h3 class="text-lg font-semibold dark:text-white">Produits vérifiés</h3>
            <p class="text-gray-600 dark:text-gray-300 text-sm">
              Qualité garantie sur chaque article vendu.
            </p>
          </div>
        </div>
      </section>

      <!-- Categories Section Title -->
      <section class="my-12 text-center max-w-7xl mx-auto">
        <h2 class="text-3xl font-semibold text-gray-700 dark:text-white">Nos catégories phares</h2>
      </section>

      <!-- Categories Section -->
      <section class="p-6 max-w-7xl mx-auto">
        <CategoriesSection />
      </section>
    </main>

    <Footer />
  </div>
</template>

<script setup>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import CategoriesSection from '@/components/CategoriesSection.vue'
</script>
