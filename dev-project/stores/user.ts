// Import de la fonction defineStore de Pinia, pour créer un store global réactif
import { defineStore } from 'pinia'

// Définition du store 'user' pour gérer l'état utilisateur (authentification)
export const useUserStore = defineStore('user', {
  
  // État du store : ici on stocke le token d'authentification (string ou null)
  state: () => ({
    token: null as string | null,
  }),

  // Getters : fonctions qui dérivent des données du state, ici pour vérifier la connexion
  getters: {
    // Retourne true si un token existe (utilisateur connecté), sinon false
    isLoggedIn: (state) => !!state.token,
  },

  // Actions : méthodes pour modifier l'état de manière contrôlée
  actions: {
    // Action pour définir/mettre à jour le token (lors de la connexion)
    setToken(token: string) {
      this.token = token
    },

    // Action pour déconnecter l'utilisateur en supprimant le token
    logout() {
      this.token = null
    }
  }
})
