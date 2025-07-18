<template> 
  <!-- Bouton Retour en haut de la page -->
  <div class="p-4 bg-white dark:bg-gray-900 shadow-md sticky top-0 z-10">
    <!-- Lien qui redirige vers la liste des produits admin -->
    <NuxtLink to="/admin/products">
      <button
        class="inline-flex items-center text-sm font-semibold text-gray-700 dark:text-white border rounded-xl px-4 py-2 bg-white dark:bg-gray-800 hover:bg-green-600 transition"
      >
        <!-- Icône flèche + texte Retour -->
        <i class="fa-solid fa-arrow-left mr-2"></i> Retour
      </button>
    </NuxtLink>
  </div>

  <!-- Section principale avec formulaire -->
  <section class="p-6 bg-gray-50 dark:bg-gray-950 min-h-screen">
    <div class="max-w-xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-xl shadow mt-10">
      <!-- Titre principal de la page -->
      <h2 class="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
        <i class="fa-solid fa-box-open text-green-600 mr-2"></i>
        Ajouter un produit
      </h2>

      <!-- Formulaire d'ajout de produit -->
      <form @submit.prevent="ajouterProduit" class="space-y-4">
        
        <!-- Champ pour le titre du produit -->
        <div class="relative">
          <i class="fa-solid fa-tag absolute left-3 top-3 text-gray-400"></i>
          <input
            v-model="form.title"
            type="text"
            placeholder="Nom du produit"
            class="w-full p-2 pl-10 border rounded bg-white dark:bg-gray-800 dark:text-white dark:border-gray-700"
            required
          />
        </div>

        <!-- Champ pour la description du produit -->
        <div class="relative">
          <i class="fa-solid fa-align-left absolute left-3 top-3 text-gray-400"></i>
          <textarea
            v-model="form.description"
            placeholder="Description"
            class="w-full p-2 pl-10 border rounded bg-white dark:bg-gray-800 dark:text-white dark:border-gray-700"
            required
          ></textarea>
        </div>

        <!-- Champ pour le prix du produit -->
        <div class="relative">
          <i class="fa-solid fa-dollar-sign absolute left-3 top-3 text-gray-400"></i>
          <input
            v-model.number="form.price"
            type="number"
            placeholder="Prix"
            class="w-full p-2 pl-10 border rounded bg-white dark:bg-gray-800 dark:text-white dark:border-gray-700"
            required
          />
        </div>

        <!-- Champ pour l'URL de l’image du produit -->
        <div class="relative">
          <i class="fa-solid fa-image absolute left-3 top-3 text-gray-400"></i>
          <input
            v-model="form.image"
            type="url"
            placeholder="URL de l’image"
            class="w-full p-2 pl-10 border rounded bg-white dark:bg-gray-800 dark:text-white dark:border-gray-700"
            required
          />
        </div>

        <!-- Sélecteur de catégorie -->
        <div class="relative">
          <i class="fa-solid fa-list absolute left-3 top-3.5 text-gray-400"></i>
          <select
            v-model="form.category"
            class="w-full p-2 pl-10 border rounded bg-white dark:bg-gray-800 dark:text-white dark:border-gray-700"
            required
          >
            <option disabled value="">Choisir une catégorie</option>
            <option>electronics</option>
            <option>jewelery</option>
            <option>men's clothing</option>
            <option>women's clothing</option>
          </select>
        </div>

        <!-- Bouton pour envoyer le formulaire -->
        <button
          type="submit"
          class="w-full bg-gray-400 text-white py-2 rounded hover:bg-green-600 dark:hover:bg-green-500"
        >
          <i class="fa-solid fa-plus mr-2"></i>
          Ajouter
        </button>
      </form>

      <!-- Message de succès ou d’erreur après l’envoi -->
      <div
        v-if="message"
        class="mt-4 text-green-600 font-semibold flex items-center gap-2 dark:text-green-400"
      >
        <i class="fa-solid fa-check-circle"></i>
        {{ message }}
      </div>
    </div>
  </section>
</template>
<script setup>
// On importe 'ref' pour créer des données réactives
import { ref } from 'vue'

// Objet contenant les données du formulaire (lié avec v-model)
const form = ref({
  title: '',        // Nom du produit
  price: 0,         // Prix
  description: '',  // Description
  image: '',        // URL de l'image
  category: ''      // Catégorie
})

// Message pour afficher le résultat de l'ajout
const message = ref('')

// Fonction qui envoie les données à l'API (POST vers /api/products)
async function ajouterProduit() {
  try {
    await $fetch('/api/products', {
      method: 'POST',
      body: form.value
    })
    // Si ça marche, on affiche un message et on vide le formulaire
    message.value = 'Produit ajouté avec succès !'
    form.value = {
      title: '',
      price: 0,
      description: '',
      image: '',
      category: ''
    }
  } catch (error) {
    // Si erreur, on affiche un message d'erreur
    message.value = 'Erreur lors de l’ajout du produit.'
    console.error(error)
  }
}
</script>
