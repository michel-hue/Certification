<template>
    <div class="p-4 bg-white shadow-md sticky top-0 z-10">
    <NuxtLink to="/carts">
      <button
        class="inline-flex items-center text-sm font-semibold text-gray-700 border rounded-xl px-4 py-2 bg-white hover:bg-green-600 transition"
      >
        <i class="fa-solid fa-arrow-left mr-2"></i> Retour 
      </button>
    </NuxtLink>
  </div>
  <section class="min-h-screen bg-gray-100 flex items-center justify-center p-6">
    <div class="bg-white shadow-lg rounded-2xl p-8 w-full max-w-xl">
      <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">
        <i class="fas fa-cart-plus text-blue-600 mr-2"></i>
        Ajouter un nouveau panier
      </h2>

      <form @submit.prevent="ajouterPanier" class="space-y-6">
        <!-- Nom du client -->
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">
            <i class="fas fa-user mr-1 text-gray-500"></i> Nom de l'Utilisateur
          </label>
          <input
            v-model="panier.nom"
            type="text"
            class="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex : Jean Dupont"
            required
          />
        </div>

        <!-- Produits -->
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">
            <i class="fas fa-boxes-stacked mr-1 text-gray-500"></i> Produits 
          </label>
          <input
            v-model="panier.produits"
            type="text"
            class="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex : mens clothes, womens clothes , electronics "
          />
        </div>
                <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">
            <i class="fas fa-boxes-stacked mr-1 text-gray-500"></i> Produits 
          </label>
          <input
            v-model="panier.produits"
            type="text"
            class="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex : mens clothes, womens clothes , electronics "
          />
        </div>
                <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">
            <i class="fas fa-boxes-stacked mr-1 text-gray-500"></i> Produits 
          </label>
          <input
            v-model="panier.produits"
            type="text"
            class="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex : mens clothes, womens clothes , electronics "
          />
        </div>

        <!-- Bouton Enregistrer -->
        <div class="text-center">
          <button
            type="submit"
            class="bg-gray-900 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-xl transition duration-300"
          >
            <i class="fas fa-plus-circle mr-2"></i>
            Enregistrer le panier
          </button>
        </div>
      </form>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const panier = ref({
  nom: '',
  produits: ''
})

const ajouterPanier = async () => {
  try {
    await $fetch('/api/paniers', {
      method: 'POST',
      body: {
        nom: panier.value.nom,
        produits: panier.value.produits.split(',').map(p => p.trim()),
      },
    })

    router.push('/panier')
  } catch (err) {
    console.error("Erreur lors de l'ajout du panier :", err)
  }
}
</script>
