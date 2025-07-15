<template>
  <section class="min-h-screen bg-gray-100 flex items-center justify-center p-6">
    <div class="bg-white shadow-lg rounded-2xl p-8 w-full max-w-xl">
      <!-- Titre -->
      <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">
        <i class="fa-solid fa-cart-plus text-green-600 mr-2"></i>
        Ajouter un panier
      </h2>

      <!-- Formulaire -->
      <form @submit.prevent="ajouterPanier" class="space-y-6">
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
            <i class="fas fa-boxes mr-1 text-gray-500"></i> Produits (séparés par des virgules)
          </label>
          <input
            v-model="produitsText"
            type="text"
            class="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex : Pain, Lait, Riz"
          />
        </div>

        <!-- Bouton Ajouter -->
        <div class="text-center">
          <button
            type="submit"
            class="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl transition duration-300"
          >
            <i class="fa-solid fa-plus mr-2"></i>
            Ajouter le panier
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
  produits: []
})

const produitsText = ref('')

// Enregistrer le nouveau panier
const ajouterPanier = async () => {
  if (!panier.value.nom.trim()) {
    alert('Le nom du client est requis.')
    return
  }

  try {
    await $fetch('/api/carts', {
      method: 'POST',
      body: {
        nom: panier.value.nom,
        produits: produitsText.value.split(',').map(p => p.trim()).filter(p => p)
      }
    })

    alert('✅ Panier ajouté avec succès !')
    router.push('/admin/carts')
  } catch (err) {
    console.error('❌ Erreur lors de l’ajout :', err)
    alert('Erreur lors de l’ajout du panier.')
  }
}
</script>
