<template>
  <section class="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-6 py-12">

      <!-- Bouton retour -->
      <NuxtLink to="/users/" class="inline-block mb-6">
        <button class="flex items-center gap-2 text-sm text-white bg-gray-300 dark:bg-white dark:text-gray-900 px-4 py-2 rounded-xl shadow hover:bg-green-600 dark:hover:bg-green-600 transition">
          <i class="fas fa-arrow-left"></i>
          Retour
        </button>
      </NuxtLink>
    <div class="max-w-5xl mx-auto">
      <!-- Titre principal -->
      <h1 class="text-4xl font-bold text-center mb-10">
        Nos Services
      </h1>

      <!-- Intro -->
      <p class="text-center text-lg text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
        Découvrez l'ensemble des services que nous mettons à votre disposition pour améliorer votre expérience et faciliter votre quotidien. Nous sommes là pour répondre à vos besoins avec efficacité et professionnalisme.
      </p>

      <!-- Grid des services -->
      <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <!-- Service 1 -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md hover:shadow-xl transition">
          <div class="text-green-600 dark:text-green-400 text-3xl mb-4">
            <i class="fas fa-shipping-fast"></i>
          </div>
          <h3 class="text-xl font-semibold mb-2">Livraison rapide</h3>
          <p class="text-gray-600 dark:text-gray-300 text-sm">
            Profitez d’un service de livraison express à domicile ou en point relais dans un délai record, partout dans le pays.
          </p>
        </div>

        <!-- Service 2 -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md hover:shadow-xl transition">
          <div class="text-green-600 dark:text-green-400 text-3xl mb-4">
            <i class="fas fa-shield-alt"></i>
          </div>
          <h3 class="text-xl font-semibold mb-2">Paiement sécurisé</h3>
          <p class="text-gray-600 dark:text-gray-300 text-sm">
            Tous vos paiements sont protégés grâce à notre système de sécurité avancé et au cryptage SSL.
          </p>
        </div>

        <!-- Service 3 -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md hover:shadow-xl transition">
          <div class="text-green-600 dark:text-green-400 text-3xl mb-4">
            <i class="fas fa-headset"></i>
          </div>
          <h3 class="text-xl font-semibold mb-2">Support client 24/7</h3>
          <p class="text-gray-600 dark:text-gray-300 text-sm">
            Une équipe disponible à tout moment pour répondre à vos questions et vous assister en cas de besoin.
          </p>
        </div>

        <!-- Service 4 -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md hover:shadow-xl transition">
          <div class="text-green-600 dark:text-green-400 text-3xl mb-4">
            <i class="fas fa-sync-alt"></i>
          </div>
          <h3 class="text-xl font-semibold mb-2">Retour facile</h3>
          <p class="text-gray-600 dark:text-gray-300 text-sm">
            Un article ne vous convient pas ? Vous pouvez le retourner sous 14 jours, sans frais supplémentaires.
          </p>
        </div>

        <!-- Service 5 -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md hover:shadow-xl transition">
          <div class="text-green-600 dark:text-green-400 text-3xl mb-4">
            <i class="fas fa-tags"></i>
          </div>
          <h3 class="text-xl font-semibold mb-2">Promotions exclusives</h3>
          <p class="text-gray-600 dark:text-gray-300 text-sm">
            Bénéficiez régulièrement d’offres spéciales, de codes promo et de remises fidélité.
          </p>
        </div>

        <!-- Service 6 -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md hover:shadow-xl transition">
          <div class="text-green-600 dark:text-green-400 text-3xl mb-4">
            <i class="fas fa-mobile-alt"></i>
          </div>
          <h3 class="text-xl font-semibold mb-2">Application mobile</h3>
          <p class="text-gray-600 dark:text-gray-300 text-sm">
            Une app intuitive pour gérer vos commandes, suivre vos livraisons et accéder aux offres depuis votre smartphone.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>


