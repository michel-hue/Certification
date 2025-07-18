<template>
  <!-- Section principale centrée, avec fond clair ou sombre -->
  <section
    class="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-6 transition-colors duration-300"
  >
    <!-- Boîte blanche (ou sombre) pour le formulaire avec arrondis et ombre -->
    <div
      class="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8 w-full max-w-xl transition-colors duration-300"
    >
      <!-- Titre avec icône -->
      <h2
        class="text-2xl font-bold text-gray-800 dark:text-green-400 mb-6 text-center flex items-center justify-center gap-2"
      >
        <i class="fa-solid fa-cart-plus text-green-600 dark:text-green-400"></i>
        Ajouter un panier
      </h2>

      <!-- Formulaire, évite le rechargement de page grâce à @submit.prevent -->
      <form @submit.prevent="ajouterPanier" class="space-y-6">
        <!-- Champ pour le nom du client -->
        <div>
          <label
            class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1 flex items-center gap-1"
          >
            <i class="fas fa-user text-gray-500 dark:text-gray-400"></i> Nom du
            client
          </label>
          <input
            v-model="panier.nom"  <!-- Liaison bidirectionnelle avec panier.nom -->
            type="text"
            class="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2
                   focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                   bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300"
            placeholder="Nom du client"
            required  <!-- Champ obligatoire -->
          />
        </div>

        <!-- Champ pour les produits, sous forme de texte avec virgules -->
        <div>
          <label
            class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1 flex items-center gap-1"
          >
            <i class="fas fa-boxes text-gray-500 dark:text-gray-400"></i> Produits
            (séparés par des virgules)
          </label>
          <input
            v-model="produitsText"  <!-- Liaison avec produitsText -->
            type="text"
            class="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2
                   focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                   bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300"
            placeholder="Ex : Pain, Lait, Riz"
          />
        </div>

        <!-- Bouton pour soumettre le formulaire -->
        <div class="text-center">
          <button
            type="submit"
            class="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600
                   text-white font-semibold px-6 py-3 rounded-xl transition duration-300 flex items-center justify-center gap-2"
          >
            <i class="fa-solid fa-plus"></i>
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

// Objet panier avec nom et liste de produits
const panier = ref({
  nom: '',
  produits: []
})

// Texte brut où l'utilisateur écrit les produits séparés par des virgules
const produitsText = ref('')

// Fonction appelée quand on soumet le formulaire
const ajouterPanier = async () => {
  // Vérifie que le nom n'est pas vide (trim enlève les espaces)
  if (!panier.value.nom.trim()) {
    alert('Le nom du client est requis.') // Message d'erreur si vide
    return
  }

  try {
    // Envoie une requête POST à l'API pour créer un nouveau panier
    await $fetch('/api/carts', {
      method: 'POST',
      body: {
        nom: panier.value.nom,
        // Transforme la chaîne en tableau : split découpe à chaque virgule,
        // trim enlève espaces autour, filter enlève éléments vides
        produits: produitsText.value
          .split(',')
          .map((p) => p.trim())
          .filter((p) => p)
      }
    })

    alert('✅ Panier ajouté avec succès !') // Confirme l'ajout
    router.push('/admin/carts') // Redirige vers la liste des paniers
  } catch (err) {
    console.error('❌ Erreur lors de l’ajout :', err)
    alert('Erreur lors de l’ajout du panier.') // Message d'erreur en cas de problème
  }
}
</script>
