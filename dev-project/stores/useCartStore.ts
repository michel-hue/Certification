//  Store Pinia pour gérer le panier de l'utilisateur

import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as any[]  //  Contenu du panier (tableau d'objets produit)
  }),

  actions: {
    //  Ajouter un produit au panier
    addToCart(product: any) {
      const existing = this.items.find(item => item.id === product.id)

      if (existing) {
        // Si le produit existe déjà, on augmente sa quantité
        existing.quantity++
      } else {
        // Sinon, on l’ajoute avec une quantité de 1
        this.items.push({ ...product, quantity: 1 })
      }

      // Sauvegarder dans le localStorage
      localStorage.setItem('cart', JSON.stringify(this.items))
    },

    //  Supprimer un produit du panier
    removeFromCart(id: number) {
      this.items = this.items.filter(item => item.id !== id)
      localStorage.setItem('cart', JSON.stringify(this.items))
    },

    //  Vider complètement le panier
    clearCart() {
      this.items = []
      localStorage.removeItem('cart')
    },

    //  Charger les données du panier depuis localStorage
    loadCart() {
      const saved = localStorage.getItem('cart')
      this.items = saved ? JSON.parse(saved) : []
    }
  }
})



