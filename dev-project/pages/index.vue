<template>
  <div class="min-h-screen bg-gray-300 flex flex-col text-gray-800">
    
    <!-- En-tête avec bouton gauche + nom centré -->
    <header class="py-6 px-6">
      <div class="flex items-center justify-between w-full">
        
        <!-- Bouton Voir les produits à gauche -->
        <NuxtLink to="/products">
          <button class="bg-gray-900 hover:bg-green-600 text-white px-4 py-2 rounded-xl transition flex items-center gap-2">
            <i class="fas fa-store"></i> Voir les produits
          </button>
        </NuxtLink>

        <!-- Logo + nom centré -->
        <div class="flex justify-center items-center gap-3 text-4xl font-bold mx-auto">
          <span class="text-green-600">🛒</span>
          <h1>Ma Boutique</h1>
        </div>

        <!-- Bloc vide pour équilibrer le centrage -->
        <div class="w-[170px]"></div>
      </div>
    </header>

    <!-- Contenu principal -->
    <main class="flex flex-1 overflow-hidden rounded-t-lg shadow-lg">
      
      <!-- Formulaire à gauche -->
  <div class="w-full md:w-1/2 flex items-center justify-center bg-gray-300 animate-zoom-in">
  <RegisterForm />
 </div>


      <!-- Bloc visuel à droite -->
      <div class="hidden md:flex w-1/2 bg-gray-900 text-white flex-col items-center justify-center p-10 text-center space-y-4 rounded-l-[3rem] animate-fade-in-up">
        <h2 class="text-3xl font-extrabold">Bienvenue sur Ma Boutique</h2>
        <p class="text-lg text-gray-300">Fais tes achats facilement et en toute confiance. On est là pour t'accompagner 🛍️</p>
      </div>
    </main>

    <!-- Icône admin en bas à droite -->
    <NuxtLink to="/admin" class="fixed bottom-4 right-4 group z-50">
      <div class="p-3 rounded-full bg-gray-900 group-hover:bg-green-600 transition relative cursor-pointer">
        <!-- Icône engrenage -->
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 6v.01M12 18v.01M6 12h.01M18 12h.01M8.465 8.465l.01.01M15.535 15.535l.01.01M8.465 15.535l.01-.01M15.535 8.465l.01-.01" />
        </svg>
        <span class="absolute right-12 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
          Admin
        </span>
      </div>
    </NuxtLink>
  </div>
</template>

<script setup>
import RegisterForm from '~/components/RegisterForm.vue'
</script>
