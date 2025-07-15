<template>
  <section class="min-h-screen bg-gray-100 flex items-center justify-center p-6">
    <div class="bg-white shadow-lg rounded-2xl p-8 w-full max-w-xl">
      <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">
        <i class="fa-solid fa-pen-to-square text-blue-600 mr-2"></i>
        Modifier le panier #{{ id }}
      </h2>

      <form @submit.prevent="modifierPanier" class="space-y-6">
        <!-- Nom du client -->
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">
            <i class="fas fa-user mr-1 text-gray-500"></i> Nom du client
          </label>
          <input
            v-model="panier.nom"
            type="text"
            class="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nom du client"
            required
          />
        </div>

        <!-- Produits -->
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">
            <i class="fas fa-box-open mr-1 text-gray-500"></i> Produits (séparés par des virgules)
          </label>
          <input
            v-model="produitsText"
            type="text"
            class="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex : Pain, Lait, Riz"
          />
        </div>

        <!-- Bouton Enregistrer -->
        <div class="text-center">
          <button
            type="submit"
            class="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl transition duration-300"
          >
            <i class="fa-solid fa-check mr-2"></i>
            Enregistrer les modifications
          </button>
        </div>
      </form>
    </div>
    
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const id = route.params.id

const panier = ref({
  nom: '',
  produits: []
})

const produitsText = ref('')

// Charger les données du panier existant
onMounted(async () => {
  try {
    const data = await $fetch(`/api/paniers/${id}`)
    panier.value = data
    produitsText.value = data.produits.join(', ')
  } catch (err) {
    console.error('Erreur lors du chargement du panier :', err)
  }
})

// Enregistrer les modifications
const modifierPanier = async () => {
  try {
    await $fetch(`/api/paniers/${id}`, {
      method: 'PUT',
      body: {
        nom: panier.value.nom,
        produits: produitsText.value.split(',').map(p => p.trim())
      }
    })
    router.push('/carts') // Redirection vers la liste
  } catch (err) {
    console.error('Erreur lors de la modification :', err)
  }
}
</script>
